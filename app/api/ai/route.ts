import { NextResponse } from 'next/server'
import { askAI } from '@/lib/openai'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const s:any = session
    if (!s || !s.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: s.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await request.json()
    const { prompt } = body
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 })

    // Fetch recent user summary to include as context (limited and anonymized)
    const last30 = await prisma.transaction.findMany({ where: { userId: user.id, status: 'POSTED' }, orderBy: { date: 'desc' }, take: 200 })
    const totalReceived = last30.filter((t:any)=>t.direction==='CREDIT').reduce((s:number,a:any)=>s+Number(a.amount),0)
    const totalSpent = last30.filter((t:any)=>t.direction==='DEBIT').reduce((s:number,a:any)=>s+Number(a.amount),0)

    const context = `User summary: last ${last30.length} transactions. Total received: ${totalReceived}. Total spent: ${totalSpent}. Do not expose raw transaction list.`

    // Compose prompt
    const finalPrompt = `${context}\nUser question: ${prompt}`

    const answer = await askAI(finalPrompt, user.id)
    return NextResponse.json({ answer })
  } catch (err) {
    console.error('AI route error', err)
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
