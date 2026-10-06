function normalizeAmount(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0

  const numeric = typeof value === 'string'
    ? Number(String(value).replace(/[^0-9.-]+/g, ''))
    : Number(value)

  if (!Number.isFinite(numeric)) return 0
  return Math.abs(numeric)
}

function normalizeDirection(value: string | null | undefined): string {
  if (typeof value !== 'string') return ''
  return value.trim().toUpperCase()
}

export function applyTransaction(balance: number, amount: number, direction: 'DEBIT' | 'CREDIT'){
  const safeBalance = Number.isFinite(Number(balance)) ? Number(balance) : 0
  const safeAmount = normalizeAmount(amount)
  const normalizedDirection = normalizeDirection(direction)

  if (normalizedDirection === 'CREDIT') return safeBalance + safeAmount
  if (normalizedDirection === 'DEBIT') return safeBalance - safeAmount
  return safeBalance
}

export function netFromTransactions(transactions: Array<{ amount: number; direction: 'DEBIT' | 'CREDIT' }>) {
  let credits = 0
  let debits = 0

  for (const t of transactions || []) {
    if (!t || typeof t !== 'object') continue

    const amount = normalizeAmount(t.amount)
    if (amount === 0) continue

    const direction = normalizeDirection(t.direction)
    if (direction === 'CREDIT') credits += amount
    else if (direction === 'DEBIT') debits += amount
  }

  return { credits, debits, net: credits - debits }
}
