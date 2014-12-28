var async = require('async')
var request = require('superagent')

function Transactions(url) {
  this.url = url
  this._limit = 25
}

Transactions.prototype.propagate = function(rawTxs, callback) {
  var self = this

  var makeRequest = function(txHex, callback) {
    request.post(self.url + 'send').send('rawtx=' + txHex).end(function(res) {
      if (!res.ok) return callback(new Error('non-ok http status code'), res)

      var data = {
        txId: res.body.txid
      }

      callback(null, data)
    })
  }

  var txs = Array.isArray(rawTxs) ? rawTxs : [ rawTxs ]
  var fns = txs.map(function(tx) {
    return function(callback) { makeRequest(tx, callback) }
  })

  async.parallelLimit(fns, self._limit, function(err, results) {
    if (err) return callback(err, results)
    callback(null, Array.isArray(rawTxs) ? results : results[0])
  })
}

module.exports = Transactions
