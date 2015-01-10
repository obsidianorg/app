var bitcoin = require('bitcoin')
var Promise = require('bluebird')

var RPC_DATA = {
  host: 'localhost',
  port: 15715,
  // localhost only, this shouldn't matter too much
  user: 'blackcoinrpc',
  // ditto as above
  pass: 'obsidian',
  timeout: 30000
}

var _client

function connect() {
  _client = new bitcoin.Client(RPC_DATA)
}

function getAddresses() {
  return new Promise(function(resolve, reject) {
    _client.cmd('listreceivedbyaddress', 0, true, function(err, res, headers) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

function getWif(address) {
  return new Promise(function(resolve, reject) {
    _client.cmd('dumpprivkey', address, function(err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

function submitTransaction(rawTx) {
  return new Promise(function(resolve, reject) {
    _client.cmd('sendrawtransaction', rawTx, function(err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

module.exports = {
  getAddresses: getAddresses,
  getWif: getWif,
  submitTransaction: submitTransaction,
  connect: connect
}

