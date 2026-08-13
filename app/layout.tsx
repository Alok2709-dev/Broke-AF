import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BROKE AF — Your money. Your rules.',
  description: 'A personal money OS for students — fast, private, and a little savage.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">{children}</div>
      </body>
    </html>
  )
}
