require('dotenv').config()
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Blockchain, Transaction } = require('./blockchain');

// initialize users wallets from private keys in .env file
const bobKey = ec.keyFromPrivate(process.env.BOB_PRIVATE_KEY);
const bobWallet = bobKey.getPublic('hex');

const aliceKey = ec.keyFromPrivate(process.env.ALICE_PRIVATE_KEY);
const aliceWallet = aliceKey.getPublic('hex');

const joeminerKey = ec.keyFromPrivate(process.env.JOEMINER_PRIVATE_KEY);
const joeminerWallet = joeminerKey.getPublic('hex');

// create new blockchain
let simpleCoin = new Blockchain();

// create first transaction, sign it and send it to the chain
const tx1 = new Transaction({
  fromAddress: bobWallet,
  toAddress: aliceWallet,
  amount: 10
});
tx1.signTransaction(bobKey);
simpleCoin.addTransaction(tx1);

// create second transaction, sign it and send it to the chain
const tx2 = new Transaction({
  fromAddress: aliceWallet,
  toAddress: bobWallet,
  amount: 5
});
tx2.signTransaction(aliceKey);
simpleCoin.addTransaction(tx2);


simpleCoin.minePendingTransactions(joeminerWallet);

console.log('-------------------');
console.log(simpleCoin.getBalanceOfAddress(bobWallet));
console.log(simpleCoin.getBalanceOfAddress(aliceWallet));
console.log(simpleCoin.getBalanceOfAddress(joeminerWallet));
console.log('-------------------');