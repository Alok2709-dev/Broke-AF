export function applyTransaction(balance: number, amount: number, direction: 'DEBIT'|'CREDIT'){
  if (direction === 'CREDIT') return balance + amount
  return balance - amount
}

export function netFromTransactions(transactions: Array<{amount:number,direction:'DEBIT'|'CREDIT'}>){
  let credits = 0, debits = 0
  for(const t of transactions){
    if (t.direction === 'CREDIT') credits += t.amount
    else debits += t.amount
  }
  return { credits, debits, net: credits - debits }
}
