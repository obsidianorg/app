var fs = require('fs-extra')
var path = require('path-extra')
var exe = require('./exe')
var qtconfig = require('./qtconfig')


var SETTINGS_FILE = path.join(path.datadir('obsidian'), 'obsidian.conf.json')

function initSync() {
  var settingsExist = fs.existsSync(SETTINGS_FILE)
  var settings = {}
  if (!settingsExist) {
    // default: no test
    settings.test = false
    settings.blockCheckInterval = 60*1000
    settings.mempoolCheckInterval = 10*1000
    settings.exe = {
      test: exe.qtapp(true),
      prod: exe.qtapp(false)
    }
  } else {
    settings = fs.readJsonSync(SETTINGS_FILE)
  }

  settings.exe = settings.exe || {}

  settings.saveSync = function() {
    fs.outputJsonSync(SETTINGS_FILE, settings)
  }

  // 'exe' property won't be saved, which is what we want
  Object.defineProperty(settings, 'exePath', {
    enumerable: false,
    get: function() {
      return settings.test ? settings.exe.test : settings.exe.prod
    },
    set: function(newPath) {
      if (settings.test) settings.exe.test = newPath
      else settings.exe.prod = newPath
    }
  })

  settings.saveSync()

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

