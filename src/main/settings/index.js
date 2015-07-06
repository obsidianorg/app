// var assign = require('object-assign')
var fs = require('fs-extra')
var path = require('path-extra')
var env = require('../../env')
var findDialog = require('./find-dialog')
var qtcfg = require('./qtconfig')

var SETTINGS_FILE = env.obsidianConfFile

function init (callback) {
  fs.exists(SETTINGS_FILE, function (settingsExist) {
    if (!settingsExist) {
      fs.outputJson(SETTINGS_FILE, require('./default'), readSettings)
    } else {
      readSettings()
    }

    function readSettings (err) {
      if (err) return callback(err)

      fs.readJson(SETTINGS_FILE, function (err, settings) {
        if (err) return callback(err)
        checkExePath(settings, function (settings) {
          checkConfPath(settings, function (settings) {
            fs.writeJson(SETTINGS_FILE, settings, function (err) {
              if (err) return callback(err)
              readQTConfig(settings.conf, function (err, rpcConfig) {
                callback(null, {
                  settings: settings,
                  rpc: rpcConfig
                })
              })
            })
          })
        })
      })
    }
  })
}

function checkExePath (settings, callback) {
  // normalize legacy way
  var binPath
  if (settings.exe) {
    if (typeof settings.exe === 'string') {
      binPath = settings.exe
    } else if (typeof settings.exe === 'object') {
      binPath = settings.exe.prod
    }
  }

  if (!binPath) binPath = env.qtBinFile
  fs.exists(binPath, function (itExists) {
    if (itExists) {
      settings.exe = binPath
      return callback(settings)
    }

    findDialog.showFindDialog('BlackCoin-qt', function (binPath) {
      if (process.platform === 'darwin') {
        var base = path.basename(binPath).replace(path.extname(binPath), '')
        binPath = path.join(binPath, 'Contents', 'MacOS', base)
      }

      settings.exe = binPath
      callback(settings)
    })
  })
}

function checkConfPath (settings, callback) {
  if (!settings.conf) settings.conf = env.qtConfFile

  // quick hack to ensure it exists always
  fs.ensureFileSync(settings.conf)

  fs.exists(settings.conf, function (itExists) {
    if (itExists) return callback(settings)

    findDialog.showFindDialog('blackcoin.conf', function (confPath) {
      settings.exe = confPath
      callback(settings)
    })
  })
}

function readQTConfig (confPath, callback) {
  var qtconfig = qtcfg.readSaveSync(confPath)
  callback(null, {
    host: 'localhost',
    // 18333 => bitcoin testnet
    port: 15715,
    user: qtconfig.rpcuser,
    pass: qtconfig.rpcpassword,
    timeout: 30 * 1000
  })
}

module.exports = {
  init: init
}
