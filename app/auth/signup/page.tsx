'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) return setError('Use a password with at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await response.json()

    if (!response.ok) {
      setLoading(false)
      setError(data.error || 'Could not create your account.')
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/dashboard' })
    setLoading(false)

    if (result?.error) {
      router.push('/auth/login')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleGoogle() {
    setError('')
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-black font-black">BA</div>
            <span className="text-xl font-bold tracking-tight">BROKE AF</span>
          </Link>
          <h1 className="text-3xl font-bold mt-8">Take control of your money.</h1>
          <p className="text-gray-400 mt-2">Create your private student money OS.</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
          <button type="button" onClick={handleGoogle} className="w-full rounded-xl border border-gray-700 bg-white text-black py-3 font-semibold hover:bg-gray-100 transition">
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gray-800 flex-1" />
            <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
            <div className="h-px bg-gray-800 flex-1" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name</label>
              <input required type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 outline-none focus:border-purple-500" placeholder="Your name" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 outline-none focus:border-purple-500" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 outline-none focus:border-purple-500" placeholder="At least 8 characters" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Confirm password</label>
              <input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 outline-none focus:border-purple-500" placeholder="Repeat your password" />
            </div>

            {error && <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</div>}

            <button disabled={loading} className="w-full rounded-xl bg-purple-600 py-3 font-bold hover:bg-purple-500 disabled:opacity-50 transition">
              {loading ? 'Creating your account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">Already have an account? <Link href="/auth/login" className="text-white font-semibold hover:underline">Log in</Link></p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">We keep each user's account and financial data separated.</p>
      </div>
    </main>
  )
}
