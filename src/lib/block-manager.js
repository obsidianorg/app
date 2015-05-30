var blkqt = require('./blkqt')
var blockChecker = require('./block-checker')
var blockCheckInterval = 30000 // require('../atom').CONFIG.settings.blockCheckInterval
var storage = require('../domwindow').localStorage

var LS_KEY = 'lastBlockCount'
var _checkingInterval

function checkBlocks () {

function getLastKnownBlockCount (callback) {
  if (storage.getItem(LS_KEY)) {
    return callback(null, parseInt(storage.getItem(LS_KEY), 10))
  }

  // if app never ran before (i.e. no stealth payments could be before this)
  blkqt.getBlockCount(function (err, bc) {
    if (err) return callback(err)
    return callback(null, bc)
  })
}

function start () {
  _checkingInterval = setInterval(checkBlocks, blockCheckInterval)
  // run it right away
  checkBlocks()
}

function stop () {
  clearInterval(_checkingInterval)
}

module.exports = {
  checkBlocks: checkBlocks,
  getLastKnownBlockCount: getLastKnownBlockCount,
  start: start,
  stop: stop
}
