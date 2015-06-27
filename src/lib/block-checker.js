var util = require('util')
var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var blkqt = require('./blkqt')
var stealthPayment = require('./stealth-payment')
var stealthPseudonym = require('./stealth-pseudonym')

function create () {
  var blockChecker = {}
  _.mixin(blockChecker, EventEmitter.prototype)
  EventEmitter.call(blockChecker)

  blockChecker.checkBlock = function (blockHeight) {
    blkqt.getRawTransactionsFromBlock(blockHeight, function (err, blockData) {
      if (err) return blockChecker.emit('error', err)
      var keys = []
      var pseudonyms = []

      Object.keys(blockData.txs).forEach(function (txId) {
        var rawTx = blockData.txs[txId]
        // check if a pseudonym registry exists
        var pseudonym = stealthPseudonym.checkTx(rawTx)
        if (pseudonym) {
          pseudonym.blockHeight = blockHeight
          pseudonym.txId = txId
          pseudonyms.push(pseudonym)
        }

        // check if stealth payment exists
        var key = stealthPayment.checkTx(rawTx)
        if (!key) return
        keys.push({
          keyPair: key,
          timestamp: blockData.timestamp,
          blockHeight: blockData.height
        })
      })

      if (keys.length > 0) blockChecker.emit('stealth:payment:received', keys)
      if (pseudonyms.length > 0) blockChecker.emit('stealth:pseudonym:registered', pseudonyms)

      blockChecker.emit('block:checked', blockHeight)
    })

    return blockChecker
  }

  blockChecker.checkBlocks = function (start, finish) {
    console.log(util.format('checking range: %d -> %d', start, finish))

    function check (current) {
      blockChecker.checkBlock(current).once('block:checked', function (blockHeight) {
        // done
        if (current === finish) {
          blockChecker.emit('finish')
        } else {
          check(current + 1)
        }
      })
    }
    check(start)

    return blockChecker
  }

  return blockChecker
}

module.exports = {
  create: create
}
