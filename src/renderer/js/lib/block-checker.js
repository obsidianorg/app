var util = require('util')
var S = require('string')
var atom = require('../atom')
var blkqt = require('./blkqt')
var dumpwallet = require('./dumpwallet')
var stealthPayment = require('./stealth-payment')
var storage = require('./storage')

// "block count" or "block height" same thing
var LS_KEY = 'lastBlockCount'
var LAST_KNOWN = 0
var TWELVE_MINS = 12 * 60 * 1000

function getLastKnownBlockCount (callback) {
  if (storage.getItem(LS_KEY)) {
    return callback(null, parseInt(storage.getItem(LS_KEY), 10))
  }

  // if app never an before (i.e. no stealth payments could be before this)
  blkqt.getBlockCount(function (err, bc) {
    if (err) return callback(err)
    storage.setItem(LS_KEY, LAST_KNOWN)
    return callback(null, bc)
  })
}

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

          importKeys(items, function (err) {
            if (err) console.error(err)
            console.log('successfully imported ' + items.length)
          })
        })
      })
    })(), atom.CONFIG.settings.blockCheckInterval)
  })
}

function importKeys (items, callback) {
  var dwText = dumpwallet.encode(items)
  var textLen = dwText.length
  var tmpFile = atom.path.join(atom.app.getPath('temp'), ('' + Math.random()).slice(2))

  atom.fs.writeFile(tmpFile, dwText, function (err) {
    if (err) return callback(err)
    blkqt.importWallet(tmpFile, function (err) {
      if (err) return callback(err)
      atom.fs.writeFile(tmpFile, S('0').repeat(textLen).s, function (err) {
        if (err) return callback(err)
        callback()
      })
    })
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

    stealthPayment.checkBlock(current, function (err, arrData) {
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

module.exports = {
  init: init
}
