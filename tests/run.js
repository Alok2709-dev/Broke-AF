const assert = require('assert')
const { applyTransaction, netFromTransactions } = require('../lib/calculations')

function testApplyTransaction(){
  let b = 1000
  b = applyTransaction(b, 500, 'CREDIT')
  assert.strictEqual(b, 1500)
  b = applyTransaction(b, 200, 'DEBIT')
  assert.strictEqual(b, 1300)

  b = applyTransaction(1000, -250, 'DEBIT')
  assert.strictEqual(b, 750)

  b = applyTransaction(1000, 250, 'UNKNOWN')
  assert.strictEqual(b, 1000)
  console.log('applyTransaction tests passed')
}

function testNetFromTransactions(){
  const txs = [
    { amount: 5000, direction: 'CREDIT' },
    { amount: 102, direction: 'DEBIT' },
    { amount: 8000, direction: 'CREDIT' },
    { amount: -250, direction: 'DEBIT' },
    { amount: 40, direction: 'UNKNOWN' },
    { amount: 0, direction: 'CREDIT' }
  ]
  const r = netFromTransactions(txs)
  assert.strictEqual(r.credits, 13000)
  assert.strictEqual(r.debits, 352)
  assert.strictEqual(r.net, 13000 - 352)
  console.log('netFromTransactions tests passed')
}

try{
  testApplyTransaction()
  testNetFromTransactions()
  console.log('All tests passed')
}catch(e){
  console.error('Tests failed', e)
  process.exit(1)
}
