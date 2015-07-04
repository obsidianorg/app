var assert = require('assert')
var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var blkqt = require('./blkqt')
var blockChecker = require('./block-checker')
var pdb = require('../db/pdb')
var blockCheckInterval = 30000 // CONFIG.settings.blockCheckInterval
var storage = require('../domwindow').localStorage

var LS_KEY = 'lastBlockCount'
var TWELVE_MINS = 12 * 60 * 1000

var blockManager = {}
_.mixin(blockManager, EventEmitter.prototype)
EventEmitter.call(blockManager)

// bad spot for this
var db = pdb.createPdb()
db.init(function (err) {
  if (err) blockManager.emit('error', err)
})

// properties
blockManager.isChecking = false
blockManager.checkingInterval = null

// methods

blockManager.checkBlocks = function () {
  if (blockManager.isChecking) return
  blockManager.isChecking = true

  function doneChecking (err) {
    if (err) blockManager.emit('error', err)
    blockManager.isChecking = false
  }

  blockManager.getLastKnownBlockCount(function (err, start) {
    if (err) return doneChecking(err)

    blkqt.getBlockCount(function (err, current) {
      if (err) return doneChecking(err)

      if (start === current) return doneChecking()

      var keysToImport = []
      blockChecker.create().checkBlocks(+start, +current)
        .on('block:checked', function (blockHeight) {
          if (blockHeight % 100 === 0) {
            console.log('checking ' + blockHeight)
            blockManager.updateLastKnown(blockHeight)
          }
        })
        .on('stealth:payment:received', function (keys) {
          console.log('got %d payments', keys.length)
          keysToImport = keysToImport.concat(keys)
        })
        .on('stealth:pseudonym:registered', function (pseudonyms) {
          if (pseudonyms.length > 0) importPseudonyms(pseudonyms)
        })
        .on('error', doneChecking)
        .on('finish', function () {
          if (keysToImport.length > 0) importKeys(keysToImport)
          blockManager.updateLastKnown(current)
          doneChecking()
        })
    })
  })
}

blockManager.getLastKnownBlockCount = function (callback) {
  if (storage.getItem(LS_KEY)) {
    return callback(null, parseInt(storage.getItem(LS_KEY), 10))
  }

  // if app never ran before (i.e. no stealth payments could be before this)
  blkqt.getBlockCount(function (err, bc) {
    if (err) return callback(err)
    return callback(null, bc)
  })
}

blockManager.start = function () {
  blockManager.checkingInterval = setInterval(blockManager.checkBlocks, blockCheckInterval)
  blockManager.checkBlocks() // run it right away
  return blockManager
}

blockManager.stop = function () {
  clearInterval(blockManager.checkingInterval)
  return blockManager
}

blockManager.updateLastKnown = function (blockHeight) {
  assert(blockHeight)
  storage.setItem(LS_KEY, blockHeight)
}

// this doesn't belong here
function importKeys (keys) {
  keys = keys.map(function (key) {
    return {
      wif: key.keyPair.privateWif,
      // probaby not necessary, but just in case
      birth: new Date((key.timestamp * 1000) - TWELVE_MINS),
      label: 'Stealth Payment (' + key.blockHeight + ')'
    }
  })

  blkqt.importKeys(keys, function (err) {
    if (err) blockManager.emit('error', err)
    console.log('successfully imported %d keys', keys.length)
  })
}

// this doesn't belong here
function importPseudonyms (pseudonyms) {
  pseudonyms.forEach(function (pseudonym) {
    var pubKeys = {
      scanPubKey: pseudonym.scanPubKey,
      payloadPubKey: pseudonym.payloadPubKey
    }

    db.add(pseudonym.pseudonym, pubKeys, pseudonym.txId, pseudonym.blockHeight, function (err) {
      if (err) blockManager.emit('error', err)
    })
  })

  console.log('successfully imported %d pseudonyms', pseudonyms.length)
}

module.exports = blockManager
