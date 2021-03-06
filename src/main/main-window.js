var path = require('path')
var window = require('electron-window')

function initAndShow (settings, callback) {
  var mainWindow = window.createWindow({
    width: 1000,
    height: 465,
    'min-width': 400,
    'min-height': 445,
    'web-preferences': {
      // mama don't need CORs now
      'web-security': false
    }
  })

  mainWindow.showUrl(path.join(__dirname, '..', '..', 'static', 'index.html'), {CONFIG: settings}, function () {
    callback(mainWindow)
  })
}

module.exports = {
  initAndShow: initAndShow
}
