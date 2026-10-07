import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body?.name || '').trim().slice(0, 80)
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 })
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must contain at least 8 characters.' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'An account with this email already exists. Try logging in.' }, { status: 409 })

    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Could not create the account.' }, { status: 500 })
  }
}
