var app = require('app')
var dialog = require('dialog')
var util = require('util')
var logger = require('../../logger')

function showFindDialog (item, callback) {
  dialog.showErrorBox('Error', util.format("Can't find %s, please select it in the next popup.", item))
  var title = util.format('Select location of %s', item)

  var options = {
    title: title,
    properties: ['openFile']
  }

  dialog.showOpenDialog(null, options, function (filePath) {
    if (!filePath) {
      logger.error('showOpenDialog(): Must make a selection to continue. ' + item)
      dialog.showErrorBox('Error', 'You must make a selection to continue.')
      app.quit()
    }

    if (!Array.isArray(filePath)) {
      // wtf could it be?
      callback(filePath)
    } else {
      callback(filePath[0])
    }
  })
}

// macos only
//    var base = path.basename(exeFile[0]).replace(path.extname(exeFile[0]), '')
//    callback(path.join(exeFile[0], 'Contents', 'MacOS', base))

module.exports = {
  showFindDialog: showFindDialog
}
