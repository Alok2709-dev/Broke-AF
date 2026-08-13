import { NextResponse } from 'next/server'
import { askAI } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, userId } = body
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 })

    // Ensure server-side only — OPENAI key must be on the server env
    const answer = await askAI(prompt, userId)
    return NextResponse.json({ answer })
  } catch (err) {
    console.error('AI route error', err)
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
