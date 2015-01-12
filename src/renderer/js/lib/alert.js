var remote = require('re' + 'mote')
var ipc = require('i' + 'pc')
var dialog = remote.require('dialog')

module.exports = {
  show: function(title, message) {
    dialog.showErrorBox(title, message)
  },

  showError: function(message) {
    // this fucks up Flux dispatcher
    //dialog.showErrorBox('Error', message)
    ipc.send('error', message)
    console.error(message)
  }
}
