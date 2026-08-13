'use client'
import React, { useState } from 'react'

export default function OnboardingPage(){
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [resetDay, setResetDay] = useState('1')
  const [savingsName, setSavingsName] = useState('')
  const [savingsTarget, setSavingsTarget] = useState('')
  const [priorities, setPriorities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function togglePriority(p: string){
    setPriorities(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p])
  }

  async function submit(){
    setLoading(true)
    setMessage('')
    const body = {
      name,
      monthlyBudget: Number(monthlyBudget),
      currency,
      resetDay: Number(resetDay),
      savingsGoal: savingsTarget ? { name: savingsName || 'Savings', targetAmount: Number(savingsTarget) } : null,
      priorities
    }

    const res = await fetch('/api/onboarding', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setMessage('Onboarding complete. Redirecting to dashboard...')
      window.location.href = '/dashboard'
    } else {
      setMessage(data.error || 'Error')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900/60 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">Welcome to BROKE AF</h1>
        <p className="text-sm text-gray-400 mt-2">Quick setup. We'll keep things private.</p>

        {step===1 && (
          <div className="mt-6">
            <label className="text-sm">What should we call you?</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white" />
            <div className="flex justify-end mt-4">
              <button onClick={()=>setStep(2)} className="px-4 py-2 bg-accent text-black rounded">Next</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="mt-6 grid gap-3">
            <label className="text-sm">Monthly spending budget</label>
            <input value={monthlyBudget} onChange={e=>setMonthlyBudget(e.target.value)} type="number" className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white" />
            <div className="flex justify-between mt-4">
              <button onClick={()=>setStep(1)} className="px-4 py-2 rounded border">Back</button>
              <button onClick={()=>setStep(3)} className="px-4 py-2 bg-accent text-black rounded">Next</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="mt-6 grid gap-3">
            <label className="text-sm">Which currency do you use?</label>
            <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <div className="flex justify-between mt-4">
              <button onClick={()=>setStep(2)} className="px-4 py-2 rounded border">Back</button>
              <button onClick={()=>setStep(4)} className="px-4 py-2 bg-accent text-black rounded">Next</button>
            </div>
          </div>
        )}

        {step===4 && (
          <div className="mt-6 grid gap-3">
            <label className="text-sm">When does your budget reset? (day of month)</label>
            <input value={resetDay} onChange={e=>setResetDay(e.target.value)} type="number" min={1} max={28} className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white" />
            <div className="flex justify-between mt-4">
              <button onClick={()=>setStep(3)} className="px-4 py-2 rounded border">Back</button>
              <button onClick={()=>setStep(5)} className="px-4 py-2 bg-accent text-black rounded">Next</button>
            </div>
          </div>
        )}

        {step===5 && (
          <div className="mt-6 grid gap-3">
            <label className="text-sm">Savings goal (optional)</label>
            <input placeholder="Goal name (e.g., Emergency fund)" value={savingsName} onChange={e=>setSavingsName(e.target.value)} className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white" />
            <input placeholder="Target amount" value={savingsTarget} onChange={e=>setSavingsTarget(e.target.value)} type="number" className="w-full mt-2 px-3 py-2 rounded bg-gray-800 text-white" />
            <div className="flex justify-between mt-4">
              <button onClick={()=>setStep(4)} className="px-4 py-2 rounded border">Back</button>
              <button onClick={()=>setStep(6)} className="px-4 py-2 bg-accent text-black rounded">Next</button>
            </div>
          </div>
        )}

        {step===6 && (
          <div className="mt-6 grid gap-3">
            <label className="text-sm">What matters most?</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Save money','Control food spending','Stop impulse purchases','Track subscriptions','Build emergency savings','Understand where money goes'].map(p=> (
                <button key={p} onClick={()=>togglePriority(p)} className={`text-left p-3 rounded ${priorities.includes(p)? 'bg-accent text-black':'bg-gray-800'}`}>{p}</button>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={()=>setStep(5)} className="px-4 py-2 rounded border">Back</button>
              <button onClick={submit} disabled={loading} className="px-4 py-2 bg-accent text-black rounded">{loading? 'Saving...':'Finish'}</button>
            </div>
            {message && <div className="mt-3 text-sm text-red-400">{message}</div>}
          </div>
        )}
      </div>
    </main>
  )
}
