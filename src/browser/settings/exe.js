var dialog = require('dialog')
var path = require('path')
var os = require('os')
var util = require('util')

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

function qtapp(isTest) {
  return isTest ? bitcoin() : blackcoin()
}

function showFindDialog(params, callback) {
  var title = util.format('Select %s-QT Location...', params.test ? 'Bitcoin' : 'BlackCoin')
  var options = {
    title:  title,
    properties: ['openFile']
  }

  function dialogCallback(exeFile) {
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
  }

  var args = [options, dialogCallback]
  if (params.browserWindow)
    args.unshift(params.browserWindow)

  dialog.showOpenDialog.apply(dialog, args)
}

module.exports = {
  bitcoin: bitcoin,
  blackcoin: blackcoin,
  qtapp: qtapp,
  showFindDialog: showFindDialog
}


