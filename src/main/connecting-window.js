var path = require('path')
var url = require('url')
var BrowserWindow = require('browser-window')

var connectingWindow = null

function initAndShow (isTest, callback) {
  connectingWindow = new BrowserWindow({
    width: 400,
    height: 200,
    show: false,
    resizable: false,
    frame: false,
    transparent: true
  })

  var indexUrl = url.format({
    protocol: 'file',
    pathname: path.resolve(__dirname, '..', 'renderer', 'connecting.html'),
    slashes: true,
    hash: isTest ? 'test' : ''
  })

  connectingWindow.loadUrl(indexUrl)

  connectingWindow.on('closed', function () {
    connectingWindow = null
  })

  connectingWindow.webContents.on('did-finish-load', function () {
    setTimeout(function () {
      callback(connectingWindow)
    }, 250)
  })
  connectingWindow.show()
}

module.exports = {
  initAndShow: initAndShow
}
