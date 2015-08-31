require('../babel/hook')

var dialog = require('dialog')
var cp = require('child_process')
var ipc = require('ipc')
var app = require('./app')
var connectingWindow = require('./connecting-window')
var log = require('../_local_modules/logger')
var mainWindow = require('./main-window')
var settings = require('./settings')
var qtclient = require('./qtclient')
var spawn = cp.spawn

log.info('starting...')
require('../_local_modules/logger/main').listener()

app.ready(function (app) {
  settings.init(function (err, settings) {
    if (err) {
      log.error(err, 'error loading settings')
      dialog.showErrorBox('Error', 'Error loading settings.')
      require('app').quit()
    }

    start(settings)
  })
})

// cfg = settings
function start (cfg) {
  // this done intentionally so that renderer (client) can access them
  global.CONFIG = cfg

  connectingWindow.initAndShow(cfg.settings.test, function (connectingWindow) {
    verifyConnected(cfg, function (err, rpcClient) {
      if (err) {
        dialog.showErrorBox('Error', "Can't connect to the QT client.")
        process.exit()
      }
      connectingWindow.close()

      initMain(rpcClient)
    })
  })
}

function verifyConnected (cfg, callback) {
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
        spawn(cfg.settings.exe)
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

function initMain (rpcClient, settings) {
  installIPCforQT(rpcClient)

  mainWindow.initAndShow(settings, function (mainWindow) {})
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
