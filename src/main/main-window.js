var path = require('path')
var window = require('electron-window')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

function initAndShow (callback) {
  var mainWindow = window.createWindow({
    width: 1000,
    height: 400,
    'web-preferences': {
      // mama don't need CORs now
      'web-security': false
    }
  })

  mainWindow.showUrl(path.join(__dirname, '..', '..', 'static', 'index.html'), {}, function () {
    callback(mainWindow)
  })
}

module.exports = {
  initAndShow: initAndShow
}
