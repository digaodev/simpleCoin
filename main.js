var SHA256 = require("crypto-js/sha256");

class Block {
  constructor(
    index,
    timestamp,
    data,
    previousHash = ''
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2022', 'Genesis block', null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

let simpleCoin = new Blockchain();
simpleCoin.addBlock(new Block(1, '10/01/2022', { amount: 4 }));
simpleCoin.addBlock(new Block(1, '20/01/2022', { amount: 4 }));

console.log(JSON.stringify(simpleCoin, null, 4));