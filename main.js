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
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce).toString();
  }

  mineBlock(difficulty) {
    // run the hashing function until we find a string which starts with some amount of zeros
    // adjusted by the difficulty
    console.log(`Mining block: ${this.index} ...`);

    console.log(this.hash);
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      // console.log(this.hash);
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2022', 'Genesis block', null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const previousBlock = this.chain[i - 1];
      const currentBlock = this.chain[i];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let simpleCoin = new Blockchain();
simpleCoin.addBlock(new Block(1, '10/01/2022', { amount: 4 }));
simpleCoin.addBlock(new Block(2, '20/01/2022', { amount: 8 }));
