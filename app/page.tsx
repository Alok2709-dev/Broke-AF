import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#050505] via-[#07070b] to-[#050505]">
      <header className="w-full max-w-5xl">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-black font-bold">BA</div>
            <span className="text-lg font-semibold tracking-tight">BROKE AF</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">Log in</Link>
            <Link href="/auth/signup" className="px-4 py-2 rounded-md bg-primary text-black font-semibold">Build My Money OS</Link>
          </div>
        </nav>
      </header>

      <section className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">BROKE AF</h1>
          <p className="text-lg text-gray-300">Know where your money goes. Before it disappears. A money OS built for students — simple, smart, and a tiny bit savage.</p>
          <div className="flex gap-4">
            <Link href="/auth/signup" className="px-6 py-3 rounded-md bg-accent text-black font-semibold">Build My Money OS</Link>
            <a href="#how" className="px-6 py-3 rounded-md border border-gray-700 text-gray-200">See how it works</a>
          </div>
          <div className="mt-6 text-sm text-gray-400">No bank passwords requested. Import statements securely — files are encrypted in transit and deleted after processing unless you save them.</div>
        </div>

        <div className="relative">
          <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-4 shadow-xl">
            <div className="h-full w-full rounded-lg border border-gray-800 flex flex-col p-4 gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-400">YOUR MONEY</div>
                  <div className="text-2xl font-bold">₹ —</div>
                  <div className="text-sm text-gray-400">left this month</div>
                </div>
                <div className="text-xs text-gray-400">Budget: —</div>
              </div>
              <div className="mt-auto text-xs text-gray-400">Preview • interactive import, analytics, AI coach</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="w-full max-w-5xl mt-20">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 rounded-2xl bg-gray-900/40">
            <h3 className="font-semibold">Import</h3>
            <p className="text-sm text-gray-400 mt-2">Drag & drop your statements (PDF/CSV/XLSX). We parse and extract transactions — you review before import.</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900/40">
            <h3 className="font-semibold">Analyze</h3>
            <p className="text-sm text-gray-400 mt-2">Clear Money In vs Money Out, trends, and smart daily allowance — all designed for student life.</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900/40">
            <h3 className="font-semibold">AI Coach</h3>
            <p className="text-sm text-gray-400 mt-2">Ask "Ask Broke AF" questions. AI accesses only your authorized transaction data and never shares keys client-side.</p>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-5xl mt-24 pb-12 text-sm text-gray-500">© BROKE AF — Designed for students. Privacy-first. Still savage.</footer>
    </main>
  )
}
