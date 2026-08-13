const assert = require('assert')
const { applyTransaction, netFromTransactions } = require('../lib/calculations')

function testApplyTransaction(){
  let b = 1000
  b = applyTransaction(b, 500, 'CREDIT')
  assert.strictEqual(b, 1500)
  b = applyTransaction(b, 200, 'DEBIT')
  assert.strictEqual(b, 1300)
  console.log('applyTransaction tests passed')
}

function testNetFromTransactions(){
  const txs = [
    { amount: 5000, direction: 'CREDIT' },
    { amount: 102, direction: 'DEBIT' },
    { amount: 8000, direction: 'CREDIT' }
  ]
  const r = netFromTransactions(txs)
  assert.strictEqual(r.credits, 13000)
  assert.strictEqual(r.debits, 102)
  assert.strictEqual(r.net, 13000 - 102)
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
