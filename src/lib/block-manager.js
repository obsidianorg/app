var blkqt = require('./blkqt')
var blockChecker = require('./block-checker')
var blockCheckInterval = require('../atom').CONFIG.settings.blockCheckInterval
var storage = require('../domwindow').localStorage

var LS_KEY = 'lastBlockCount'
var _checkingInterval

function checkBlocks () {

}

function start () {
  _checkingInterval = setInterval(checkBlocks, blockCheckInterval)
  // run it right away
  checkBlocks()
}

function stop() () {
  clearInterval(_checkingInterval)
}
module.exports = {
  checkBlocks: checkBlocks,
  start: start,
  stop: stop
}
