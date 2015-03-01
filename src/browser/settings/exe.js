var dialog = require('dialog')
var path = require('path')
var os = require('os')

function bitcoin() {
  var ost = os.type().toLowerCase()
  if (ost.indexOf('darwin') === 0) {
    return '/Applications/Bitcoin-Qt.app/Contents/MacOS/Bitcoin-Qt'
  }
  else if (ost.indexOf('win') === 0) {
    return 'C:\\Program Files\\Bitcoin\\bitcoin-qt.exe'
  }
}

function blackcoin() {
  var ost = os.type().toLowerCase()
  if (ost.indexOf('darwin') === 0) {
    return '/Applications/BlackCoin-Qt.app/Contents/MacOS/BlackCoin-Qt'
  }
  else if (ost.indexOf('win') === 0) {
    return 'C:\\Program Files\\Bitcoin\\blackcoin-qt.exe'
  }
}

function showFindDialog(browserWindow, callback) {
  if (typeof browserWindow === 'function') {
    callback = browserWindow
    browserWindow = null
  }

  var options = {
    title: 'Select BlackCoin-QT',
    properties: ['openFile']
  }

  dialog.showOpenDialog(browserWindow, options, function(exeFile) {
    if (!Array.isArray(exeFile)) {
      // probably undefined
      return callback(exeFile)
    }

    var ost = os.type().toLowerCase()
    if (ost.indexOf('darwin') < 0) {
      return callback(exeFile[0])
    }

    // macos only
    var base = path.basename(exeFile[0]).replace(path.extname(exeFile[0]), '')
    callback(path.join(exeFile[0], 'Contents', 'MacOS', base))
  })
}

module.exports = {
  bitcoin: bitcoin,
  blackcoin: blackcoin,
  showFindDialog: showFindDialog
}


