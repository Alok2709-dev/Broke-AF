import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request){
  try{
    const session = await getServerSession(authOptions as any)
    const s:any = session
    if (!s || !s.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: s.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { date, amount, direction, merchant, description, categoryId, source, accountId, reference, confidence, notes, currency } = body

    const tx = await prisma.transaction.create({ data: {
      userId: user.id,
      date: date ? new Date(date) : new Date(),
      amount: amount,
      currency: currency || 'INR',
      direction: direction === 'CREDIT' ? 'CREDIT' : 'DEBIT',
      merchant,
      description,
      categoryId: categoryId || null,
      source,
      accountId: accountId || null,
      reference,
      confidence: confidence || null,
    } })

    return NextResponse.json({ ok: true, tx })
  }catch(err){
    console.error('tx create error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request){
  try{
    const session = await getServerSession(authOptions as any)
    const s:any = session
    if (!s || !s.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: s.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const q = new URL(req.url).searchParams
    const limit = Number(q.get('limit') || 50)

    const txs = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' }, take: limit })
    return NextResponse.json({ ok:true, txs })
  }catch(err){
    console.error('tx list error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
