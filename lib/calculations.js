function applyTransaction(balance, amount, direction){
  if (direction === 'CREDIT') return balance + amount
  return balance - amount
}

function netFromTransactions(transactions){
  let credits = 0, debits = 0
  for(const t of transactions){
    if (t.direction === 'CREDIT') credits += t.amount
    else debits += t.amount
  }
  return { credits, debits, net: credits - debits }
}

module.exports = { applyTransaction, netFromTransactions }
