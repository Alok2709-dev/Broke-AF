import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
      const s:any = session
      if (!s || !s.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const userEmail = s.user.email
      const user = await prisma.user.findUnique({ where: { email: userEmail } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { name, monthlyBudget, currency = 'INR', resetDay = 1, savingsGoal, priorities = [] } = body

    // update user name
    await prisma.user.update({ where: { id: user.id }, data: { name } })

    // Upsert preferences (store currency). Priorities will be saved in an audit log for now to avoid schema drift.
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: { userId: user.id, currency },
      update: { currency }
    })

    // Save priorities as an audit log entry (client-visible preferences will be read from AuditLog until schema migration applied)
    if (Array.isArray(priorities) && priorities.length > 0) {
      await prisma.auditLog.create({ data: { userId: user.id, action: 'onboarding:priorities', meta: { priorities } } })
    }

    // Create monthly budget entry
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        name: 'Monthly Budget',
        amount: monthlyBudget,
        currency: currency,
        resetDay: Number(resetDay)
      }
    })

    // Optional savings goal
    let goal = null
    if (savingsGoal && savingsGoal.targetAmount) {
      goal = await prisma.goal.create({
        data: {
          userId: user.id,
          name: savingsGoal.name || 'Savings Goal',
          targetAmount: savingsGoal.targetAmount,
          currentAmount: savingsGoal.currentAmount || 0,
          currency: currency,
          deadline: savingsGoal.deadline ? new Date(savingsGoal.deadline) : null
        }
      })
    }

    return NextResponse.json({ ok: true, budget, goal })
  } catch (err) {
    console.error('onboarding error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
