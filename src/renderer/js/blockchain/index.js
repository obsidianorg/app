var Blockchain = require('cb-insight')

var blockchain = new Blockchain('http://blkchain.info', {
  endpoints: {
    addresses: 'address/', //default is 'addr'
    transactions: 'tx/'
  }
})

module.exports = {
  addresses: {
    summary: blockchain.addresses.summary.bind(blockchain.addresses)
  }
}
