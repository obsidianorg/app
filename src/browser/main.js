var path = require('path')
var url = require('url')
var app = require('app')
var BrowserWindow = require('browser-window')
var blkqt = require('./blkqt-raw')
var blockListener = require('./block-listener')

var _qtClient = blkqt.connect()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  //if (process.platform != 'darwin')
  app.quit()
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 800,
    show: false,
    resizable: false,
    frame: true
  })

  var indexPath = path.resolve(__dirname, '..', 'renderer', 'index.html')
  var indexUrl = url.format({
    protocol: 'file',
    pathname: indexPath,
    slashes: true
  })

  mainWindow.loadUrl(indexUrl)

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  // nothing needed here yet
  mainWindow.webContents.on('did-finish-load', function() {})

  mainWindow.show()

  blockListener.createListener(function(blockHash) {
    _qtClient.cmd('getblock', blockHash, function(err, blockData) {
      if (err) return console.error(err)
      console.dir(blockData.tx)
    })
  }).listen(14921)
})




// hacky messaging solution, switch to fancy html errors
require('ipc').on('error', function(event, message) {
  require('dialog').showErrorBox('Error', message)
})

