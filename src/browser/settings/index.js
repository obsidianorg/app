var fs = require('fs-extra')
var path = require('path-extra')
var qtconfig = require('./qtconfig')

var SETTINGS_FILE = path.join(path.datadir('obsidian'), 'obsidian.conf.json')

function initSync() {
  var settingsExist = fs.existsSync(SETTINGS_FILE)
  var settings = {}
  if (!settingsExist) {
    // default: no test
    settings.test = false
    settings.blockCheckInterval = 60*1000
    fs.outputJsonSync(SETTINGS_FILE, settings)
  } else {
    settings = fs.readJsonSync(SETTINGS_FILE)
  }

  var qtconfig = readQtConfig(settings.test)

  return {
    settings: settings,
    rpc: {
      host: 'localhost',
      // 18333 => bitcoin testnet
      port: settings.test ? 18333 : 15715,
      user: qtconfig.rpcuser,
      pass: qtconfig.rpcpassword,
      timeout: 30*1000
    }
  }
}

function readQtConfig(isTest) {
  var data = qtconfig.readSync(isTest)

  // rpc info may already be set
  data.rpcuser = data.rpcuser || 'rpcuser'
  data.rpcpassword = data.rpcpassword || 'obsidian'

  qtconfig.saveSync(data, isTest)

  return data
}

module.exports = {
  initSync: initSync
}

