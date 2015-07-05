var dialog = require('dialog')
var cp = require('child_process')
var fs = require('fs')
var ipc = require('ipc')
var util = require('util')
var app = require('./app')
var connectingWindow = require('./connecting-window')
var log = require('../logger')
var mainWindow = require('./main-window')
var settings = require('./settings')
var exe = require('./settings/exe')
var qtclient = require('./qtclient')
var spawn = cp.spawn

log.info('starting...')
require('../logger/main').listener()
var cfg = settings.initSync()

app.ready(function (app) {
  if (!fs.existsSync(cfg.settings.exePath)) {
    dialog.showErrorBox('Error', util.format("Can't find %s-qt. Please locate it.", cfg.settings.test ? 'Bitcoin' : 'BlackCoin'))
    exe.showFindDialog({test: cfg.settings.test}, function (newPath) {
      if (!newPath) {
        dialog.showErrorBox('Error', 'You must make a selection to continue.')
        process.exit()
      }

      cfg.settings.exePath = newPath
      cfg.settings.saveSync()
      start()
    })
  } else {
    start()
  }
})

function start () {
  // this done intentionally so that renderer (client) can access them
  global.CONFIG = cfg

  connectingWindow.initAndShow(cfg.settings.test, function (connectingWindow) {
    verifyConnected(function (err, rpcClient) {
      if (err) {
        dialog.showErrorBox('Error', "Can't connect to the QT client.")
        process.exit()
      }
      connectingWindow.close()

      initMain(rpcClient)
    })
  })
}

function verifyConnected (callback) {
  var started = false
  var checker = setInterval(check, 1000)

  var to = setTimeout(function () {
    breakOut(new Error('Timeout trying to connect.'))
  }, 120 * 1000)

  var connectingToQt = false
  function check () {
    if (connectingToQt) return

    connectingToQt = true
    qtclient.connect(cfg.rpc, function (err, rpcClient) {
      connectingToQt = false
      if (err && !started) {
        spawn(cfg.settings.exePath)
        started = true
      } else if (!err) {
        breakOut(null, rpcClient)
      }
    })
  }

  function breakOut (err, rpcClient) {
    clearInterval(checker)
    clearTimeout(to)
    callback(err, rpcClient)
  }
}

function initMain (rpcClient) {
  installIPCforQT(rpcClient)

  mainWindow.initAndShow(function (mainWindow) {})
}

// so client JS can easily query RPC commands
function installIPCforQT (rpcClient) {
  ipc.on('blkqt', function (event, obj) {
    var callback = function (err, res) {
      var msg = obj.msg + '-' + obj.token
      if (err) event.sender.send(msg, err.message, null)
      else event.sender.send(msg, null, res)
    }

    obj.args.push(callback)
    rpcClient.cmd.apply(rpcClient, obj.args)
  })
}

// hacky messaging solution, switch to fancy html errors
require('ipc').on('error', function (event, message) {
  dialog.showErrorBox('Error', message)
})
