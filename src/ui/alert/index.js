var ipc = require('ipc')
var remote = require('remote')
var dialog = remote.require('dialog')

function showError (message) {
  if (message instanceof Error) {
    message = message.message + '\n\n' + message.stack
  }

  // this fucks up Flux dispatcher
  // dialog.showErrorBox('Error', message)

  ipc.send('error', message)
  console.error(message)
}

function showMessageBox (window, options, callback) {
  return dialog.showMessageBox(window, options, callback)
}

module.exports = {
  showError: showError,
  showMessageBox: showMessageBox
}
