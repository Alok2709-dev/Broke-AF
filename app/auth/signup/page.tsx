import React from 'react'
import Link from 'next/link'

export default function SignupPage(){
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-900/60 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">Create your BROKE AF account</h1>
        <p className="text-sm text-gray-400 mt-2">Sign up with email or continue with Google.</p>
        <form className="mt-6 grid gap-3">
          <label className="text-sm text-gray-300">Full name</label>
          <input type="text" name="name" className="px-3 py-2 rounded bg-gray-800 text-white" />
          <label className="text-sm text-gray-300">Email</label>
          <input type="email" name="email" className="px-3 py-2 rounded bg-gray-800 text-white" />
          <button className="px-4 py-2 rounded bg-accent text-black font-semibold">Create account</button>
        </form>
        <div className="mt-4 text-sm text-gray-400">Already have an account? <Link href="/auth/login" className="text-white">Log in</Link></div>
      </div>
    </main>
  )
}
