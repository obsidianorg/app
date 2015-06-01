var util = require('util')
var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var blkqt = require('./blkqt')
var stealthPayment = require('./stealth-payment')

function create () {
  var blockChecker = {}
  _.mixin(blockChecker, EventEmitter.prototype)
  EventEmitter.call(blockChecker)

  blockChecker.run = function (start, finish) {
    start = parseInt(start, 10)
    finish = parseInt(finish, 10)

    blockChecker.checkBlocks(start, finish)
  }

  blockChecker.checkBlock = function (blockHeight) {
    blkqt.getRawTransactionsFromBlock(blockHeight, function (err, blockData) {
      if (err) return blockChecker.emit('error', err)
      var keys = []
      Object.keys(blockData.txs).forEach(function (txId) {
        var rawTx = blockData.txs[txId]
        var key = stealthPayment.checkTx(rawTx)
        if (!key) return
        keys.push({
          keyPair: key,
          timestamp: blockData.timestamp,
          blockHeight: blockData.height
        })
      })

      if (keys.length > 0) {
        blockChecker.emit('stealth:payment:received', keys)
      }

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
