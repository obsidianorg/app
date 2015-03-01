var path = require('path')
var url = require('url')
var app = require('app')
var BrowserWindow = require('browser-window')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

function initAndShow (callback) {
  // quit when all windows are closed.
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

    mainWindow.webContents.on('did-finish-load', function() {
      callback(app, mainWindow)
    })
    mainWindow.show()
  })
}

module.exports = {
  initAndShow: initAndShow
}

