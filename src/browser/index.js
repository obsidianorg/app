var dialog = require('dialog')
var cp = require('child_process')
var fs = require('fs')
var util = require('util')
var app = require('./app')
var connectingWindow = require('./connecting-window')
var mainWindow = require('./main-window')
var blkqt = require('./blkqt-raw')
var blockListener = require('./block-listener')
var settings = require('./settings')
var exe = require('./settings/exe')
var qtclient = require('./qtclient')
var spawn = cp.spawn

var cfg = settings.initSync()

if (!fs.existsSync(cfg.settings.exePath)) {
  dialog.showError('Error', util.format("Can't find %s-qt. Please locate it.", cfg.settings.test ? 'Bitcoin' : 'BlackCoin'))
  exe.showFindDialog({test: cfg.settings.test}, function(newPath) {
    cfg.settings.exePath = newPath
    cfg.settings.saveSync()
    start()
  })
}
else {
  start()
}

function start() {
  app.ready(function(app) {
    connectingWindow.initAndShow(cfg.settings.test, function (connectingWindow) {
      verifyConnected(function(err) {
        if (err) return dialog.showErrorBox('Error', "Can't connect to the QT client.")
        connectingWindow.close()

        initMain()
      })
    })
  })
}

function verifyConnected(callback) {
  var started = false

  var checker = setInterval(function() {
    check()
  }, 500)

  var to = setTimeout(function() {
    clearInterval(check)
    return callback(new Error('Timeout trying to connect.'))
  }, 120*1000)

  function check() {
    qtclient.connect(cfg.rpc, function(err, rpcClient) {
      if (err && !started) {
        spawn(cfg.settings.exePath)
        started = true
        return
      } else if (!err) {
        clearInterval(checker)
        return callback(null, rpcClient)
      }
    })
  }
}

function initMain(rpcClient) {
  installIPCforQT(rpcClient)

  mainWindow.initAndShow(function(mainWindow) {
    blockListener.createListener(function(blockHash) {
      rpcClient.cmd('getblock', blockHash, function(err, blockData) {
        if (err) return console.error(err)
        console.dir(blockData.tx)
       mainWindow.webContents.send('blockchain:tx:listen', blockData.tx)
      })
    }).listen(14921)
  })
}

// so client JS can easily query RPC commands
function installIPCforQT(rpcClient) {
  ipc.on('blkqt', function(event, obj) {
    var callback = function(err, res) {
      var msg = obj.msg + '-' + obj.token
      if (err)
        event.sender.send(msg, err.message, null)
      else
        event.sender.send(msg, null, res)
    }

    obj.args.push(callback)
    rpcClient.cmd.apply(rpcClient, obj.args)
  })
}

// hacky messaging solution, switch to fancy html errors
require('ipc').on('error', function(event, message) {
  dialog.showErrorBox('Error', message)
})

