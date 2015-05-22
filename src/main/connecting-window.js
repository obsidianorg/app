var path = require('path')
var window = require('electron-window')

function initAndShow (isTest, callback) {
  var connectingWindow = window.createWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true
  })

  connectingWindow.showUrl(path.resolve(__dirname, '..', '..', 'static', 'connecting.html'), {test: false}, function () {
    setTimeout(function () {
      callback(connectingWindow)
    }, 250)
  })
}

module.exports = {
  initAndShow: initAndShow
}
