var url = require('url')
var Addresses = require('./addresses')
var Transactions = require('./transactions')

function Blockchain(apiUrl, options) {
  options = options || {}

  // some APIs have renamed this to 'address' for some reason
  options.endpoints = options.endpoints || {
    addresses: 'addr/',
    transactions: 'tx/' 
  }

  // todo: come up with a better name
  options.multiplier = options.multiplier || 1e8 

  var urlObj = url.parse(apiUrl)
  this.url = urlObj.protocol + '//' + urlObj.hostname + '/api/'

  this.addresses = new Addresses(this.url + options.endpoints.addresses)
  this.addresses._multiplier = options.multiplier

  this.transactions = new Transactions(this.url + options.endpoints.transactions)
}

module.exports = Blockchain
