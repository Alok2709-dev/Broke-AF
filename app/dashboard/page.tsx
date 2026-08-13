import React from 'react'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'

function formatCurrency(amount: number, currency = 'INR'){
  try{
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
  }catch(e){
    return `${currency} ${amount}`
  }
}

export default async function DashboardPage(){
  const session = await getServerSession(authOptions as any)
  const s:any = session
  if (!s || !s.user?.email) {
    return (<div className="p-8">Please <a href="/auth/login">log in</a></div>)
  }
  const user = await prisma.user.findUnique({ where: { email: s.user.email } })
  if (!user) return (<div className="p-8">User not found</div>)

  // load user's budget (assume first monthly budget)
  const budget = await prisma.budget.findFirst({ where: { userId: user.id } })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59)

  // totals for this month
  const credits = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { userId: user.id, direction: 'CREDIT', status: 'POSTED', date: { gte: startOfMonth, lte: endOfMonth } }
  })
  const debits = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { userId: user.id, direction: 'DEBIT', status: 'POSTED', date: { gte: startOfMonth, lte: endOfMonth } }
  })

  const totalReceived = Number(credits._sum.amount ?? 0)
  const totalSpent = Number(debits._sum.amount ?? 0)

  // current stash (net of all posted transactions)
  const creditsAll = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { userId: user.id, direction: 'CREDIT', status: 'POSTED' } })
  const debitsAll = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { userId: user.id, direction: 'DEBIT', status: 'POSTED' } })
  const currentStash = Number(creditsAll._sum.amount ?? 0) - Number(debitsAll._sum.amount ?? 0)

  // transaction count
  const txCount = await prisma.transaction.count({ where: { userId: user.id, status: 'POSTED', date: { gte: startOfMonth, lte: endOfMonth } } })

  // burn rate: average daily spend this month
  const daysPassed = now.getDate()
  const burnRate = daysPassed > 0 ? totalSpent / daysPassed : 0

  // daily safe spend: remaining budget / remaining days
  const monthlyBudgetAmount = budget ? Number(budget.amount) : 0
  const remainingBudget = monthlyBudgetAmount - totalSpent
  const daysInMonth = endOfMonth.getDate()
  const remainingDays = Math.max(1, daysInMonth - daysPassed)
  const dailySafe = remainingBudget / remainingDays

  // Broke Level (simple score 0-100)
  const budgetRatio = monthlyBudgetAmount > 0 ? Math.max(0, (monthlyBudgetAmount - totalSpent) / monthlyBudgetAmount) : 1
  const score = Math.round(budgetRatio * 100)

  // categories top
  const categories = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: { userId: user.id, status: 'POSTED', date: { gte: startOfMonth, lte: endOfMonth } },
    orderBy: { _sum: { amount: 'desc' } },
    take: 6
  })

  // recent transactions
  const recent = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' }, take: 8 })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 p-6 bg-gray-900/40 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-400">YOUR MONEY</div>
                <div className="text-3xl font-bold">{formatCurrency(remainingBudget, budget?.currency || 'INR')}</div>
                <div className="text-sm text-gray-400">left this month</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Budget</div>
                <div className="text-lg font-semibold">{formatCurrency(monthlyBudgetAmount, budget?.currency || 'INR')}</div>
                <div className="text-sm text-gray-400">{formatCurrency(totalSpent, budget?.currency || 'INR')} spent</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/40 rounded">
                <div className="text-sm text-gray-400">Money received (this month)</div>
                <div className="text-lg font-semibold">{formatCurrency(totalReceived, budget?.currency || 'INR')}</div>
              </div>
              <div className="p-4 bg-gray-800/40 rounded">
                <div className="text-sm text-gray-400">Money out (this month)</div>
                <div className="text-lg font-semibold">{formatCurrency(totalSpent, budget?.currency || 'INR')}</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-400">Spending categories</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {categories.map((c:any)=> (
                  <div key={String(c.category || 'uncat')} className="p-3 bg-gray-800/30 rounded">
                    <div className="text-sm">{c.category || 'Uncategorized'}</div>
                    <div className="font-semibold">{formatCurrency(Number(c._sum.amount ?? 0), budget?.currency || 'INR')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="p-6 bg-gray-900/30 rounded-2xl">
            <div className="text-sm text-gray-400">Current stash</div>
            <div className="text-2xl font-bold">{formatCurrency(currentStash, budget?.currency || 'INR')}</div>
            <div className="mt-4 text-sm text-gray-400">Burn rate: {formatCurrency(burnRate, budget?.currency || 'INR')} / day</div>
            <div className="mt-2 text-sm text-gray-400">Daily safe: {formatCurrency(dailySafe, budget?.currency || 'INR')}</div>
            <div className="mt-2 text-sm text-gray-400">Runway: {burnRate>0? Math.round(currentStash / burnRate): '—'} days</div>
            <div className="mt-4 text-sm text-gray-400">Transactions this period: {txCount}</div>
            <div className="mt-4 text-sm text-gray-400">Money Health: {score}/100</div>
          </aside>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <div className="mt-3 grid gap-2">
            {recent.map((tx:any)=> (
              <div key={tx.id} className="p-3 bg-gray-900/40 rounded flex justify-between">
                <div>
                  <div className="font-semibold">{tx.merchant || tx.description || '—'}</div>
                  <div className="text-sm text-gray-400">{new Date(tx.date).toLocaleString()}</div>
                </div>
                <div className={`font-semibold ${tx.direction==='DEBIT'? 'text-red-400':'text-green-400'}`}>{formatCurrency(Number(tx.amount), tx.currency)}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
