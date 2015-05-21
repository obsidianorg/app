var app = require('app')

function ready (callback) {
  // quit when all windows are closed.
  app.on('window-all-closed', function () {
    // if (process.platform != 'darwin')
    app.quit()
  })

  app.on('ready', function () {
    setTimeout(function () {
      callback(app)
    }, 200)
  })
}

module.exports = {
  ready: ready
}
