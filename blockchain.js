const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor({ fromAddress, toAddress, amount }) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('Invalid key: unable to sign transaction for another wallet.');
    }

    const txHash = this.calculateHash();
    const signature = signingKey.sign(txHash, 'base64');
    this.signature = signature.toDER('hex');
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('Invalid transaction: no signature found.');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(
    timestamp,
    transactions,
    previousHash = ''
  ) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce).toString();
  }

  mineBlock(difficulty) {
    // run the hashing function until we find a string which starts with some amount of zeros
    // adjusted by the difficulty
    console.log(`Mining block: ...`);

    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block successfully mined: ${this.hash}`);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) return false;
    }

    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4; // starting number of zeros
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('01/01/2022', 'Genesis block', null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const txReward = new Transaction({
      fromAddress: null,
      toAddress: miningRewardAddress,
      amount: this.miningReward
    });
    this.pendingTransactions.push(txReward);

    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Invalid address: from and to addresses must be informed.');
    }

    if (!transaction.isValid()) {
      throw new Error('Invalid transaction: cannot add malformed transaction to the chain.');
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) {
          balance = balance - tx.amount;
        }

        if (tx.toAddress === address) {
          balance = balance + tx.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const previousBlock = this.chain[i - 1];
      const currentBlock = this.chain[i];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;

      if (currentBlock.previousHash !== previousBlock.hash) return false;

      if (!currentBlock.hasValidTransactions()) return false;
    }

    return true;
  }
}

module.exports = {
  Blockchain,
  Transaction
}