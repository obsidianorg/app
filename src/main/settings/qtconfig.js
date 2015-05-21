var fs = require('fs-extra')
var ini = require('ini')
var path = require('path-extra')
var _ = require('lodash')

// we use Bitcoin testnet to test capabilities since Bitcoin testnet coins
// are easy and free to acquire
var TEST_FILE = path.join(path.datadir('Bitcoin'), 'bitcoin.conf')
var PROD_FILE = path.join(path.datadir('BlackCoin'), 'blackcoin.conf')

var DEFAULT_SETTINGS = {
  server: 1
}

function readSync (isTest) {
  var text = ''
  try {
    text = fs.readFileSync(isTest ? TEST_FILE : PROD_FILE).toString('utf8')
  } catch (e) {}

  var data = ini.parse(text)
  data = _.assign(data, DEFAULT_SETTINGS)

  if (isTest) {
    data.testnet = 1
  }

  return data
}

function saveSync (data, isTest) {
  if (isTest) {
    data.testnet = 1
  }

  var text = ini.encode(data)

  fs.outputFileSync(isTest ? TEST_FILE : PROD_FILE, text)
}

module.exports = {
  TEST_FILE: TEST_FILE,
  PROD_FILE: PROD_FILE,
  readSync: readSync,
  saveSync: saveSync
}
