var mainWindow = require('./main-window')
var blkqt = require('./blkqt-raw')
var blockListener = require('./block-listener')

var _qtClient = blkqt.connect()

mainWindow.initAndShow(function(mainWindow) {
  blockListener.createListener(function(blockHash) {
    _qtClient.cmd('getblock', blockHash, function(err, blockData) {
      if (err) return console.error(err)
      console.dir(blockData.tx)
     mainWindow.webContents.send('blockchain:tx:listen', blockData.tx)
    })
  }).listen(14921)
})

// hacky messaging solution, switch to fancy html errors
require('ipc').on('error', function(event, message) {
  require('dialog').showErrorBox('Error', message)
})

