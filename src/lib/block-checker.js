var util = require('util')
var atom = require('../atom')
var blkqt = require('./blkqt')
var stealthPayment = require('./stealth-payment')
var storage = require('../domwindow').localStorage

// "block count" or "block height" same thing
var LS_KEY = 'lastBlockCount'
var LAST_KNOWN = 0
var TWELVE_MINS = 12 * 60 * 1000

function updateLastKnown (blockHeight) {
  LAST_KNOWN = blockHeight
  storage.setItem(LS_KEY, LAST_KNOWN)
}

function init (callback) {
  getLastKnownBlockCount(function (err, blockCount) {
    if (err) return callback(err)
    LAST_KNOWN = blockCount

    var isChecking = false
    /*var blockInterval = */setInterval((function () {
      blkqt.getBlockCount(function (err, currentBlockcount) {
        if (isChecking) return
        if (LAST_KNOWN === currentBlockcount) return

        if (err) return console.error(err)

        isChecking = true
        checkBlocks(LAST_KNOWN, currentBlockcount, function (err, items) {
          isChecking = false
          if (err) return console.error(err)

          updateLastKnown(currentBlockcount)
          if (items.length === 0) return

          blkqt.importKeys(items, function (err) {
            if (err) console.error(err)
            console.log('successfully imported ' + items.length)
          })
        })
      })
    })(), atom.CONFIG.settings.blockCheckInterval)
  })
}

function checkBlocks (start, finish, callback) {
  start = parseInt(start, 10)
  finish = parseInt(finish, 10)

  var items = []

  console.log(util.format('checking range: %d -> %d', start, finish))

  function check (current) {
    if (current % 100 === 0) {
      console.log(current)
      updateLastKnown(current)
    }

    checkBlock(current, function (err, arrData) {
      if (err) return callback(err)

      if (arrData.length > 0) {
        console.log('we have data! ' + current)
        // unlikely to be more than one
        arrData.forEach(function (item) {
          items.push({
            wif: item.keyPair.privateWif,
            // probaby not necessary, but just in case
            birth: new Date((item.timestamp * 1000) - TWELVE_MINS),
            label: 'Stealth Payment (' + current + ')'
          })
        })
      }

      // done
      if (current === finish) {
        return callback(null, items)
      } else {
        check(current + 1)
      }
    })
  }
  check(start)
}

function checkBlock (blockHeight, callback) {
  blkqt.getRawTransactionsFromBlock(blockHeight, function (err, blockData) {
    if (err) return callback(err)
    var keys = []
    blockData.txs.forEach(function (rawTx) {
      var key = stealthPayment.checkTx(rawTx)
      if (key) keys.push({keyPair: key, timestamp: blockData.timestamp, blockHeight: blockData.blockHeight})
    })

    callback(null, keys)
  })
}

module.exports = {
  init: init
}
