import React from 'react'
import Link from 'next/link'

export default function LoginPage(){
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-900/60 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">Log in to BROKE AF</h1>
        <p className="text-sm text-gray-400 mt-2">Sign in with your email or continue with Google.</p>
        <form className="mt-6 grid gap-3">
          <label className="text-sm text-gray-300">Email</label>
          <input type="email" name="email" className="px-3 py-2 rounded bg-gray-800 text-white" />
          <button className="px-4 py-2 rounded bg-accent text-black font-semibold">Send magic link</button>
        </form>
        <div className="mt-4 text-sm text-gray-400">Don’t have an account? <Link href="/auth/signup" className="text-white">Sign up</Link></div>
      </div>
    </main>
  )
}
