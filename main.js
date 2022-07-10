const { Blockchain, Transaction } = require('./blockchain');

let simpleCoin = new Blockchain();

simpleCoin.createTransaction(new Transaction({
  fromAddress: 'bob',
  toAddress: 'alice',
  amount: 10
}));
simpleCoin.createTransaction(new Transaction({
  fromAddress: 'alice',
  toAddress: 'bob',
  amount: 5
}));

simpleCoin.minePendingTransactions('joe-miner');
simpleCoin.minePendingTransactions('joe-miner');

console.log('-------------------');
console.log(simpleCoin.getBalanceOfAddress('bob'));
console.log(simpleCoin.getBalanceOfAddress('alice'));
console.log(simpleCoin.getBalanceOfAddress('joe-miner'));
console.log('-------------------');