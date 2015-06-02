var path = require('path')
var window = require('electron-window')

function initAndShow (callback) {
  var mainWindow = window.createWindow({
    width: 1000,
    height: 385,
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
