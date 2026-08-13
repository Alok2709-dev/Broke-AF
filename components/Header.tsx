import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-black font-bold">BA</div>
          <span className="font-semibold">BROKE AF</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
          <Link href="/transactions" className="text-sm text-gray-300 hover:text-white">Transactions</Link>
          <Link href="/ai" className="text-sm text-gray-300 hover:text-white">AI Coach</Link>
        </nav>
      </div>
    </header>
  )
}
