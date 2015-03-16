var ipc = require('i' + 'pc')
var txUtils = require('./txutils')
var blkqt = require('../lib/blkqt')

ipc.on('blockchain:tx:listen', function(txs) {
  txs.forEach(function(txId) {
    blkqt.getRawTransaction(txId, function(err, rawTx) {
      if (err) return console.error(err)
      //checkTx(rawTx)
    })
  })
})
