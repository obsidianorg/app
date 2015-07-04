// JSX only for now
require('babel/register')({
  only: '*.react.js'
})

require('./devtools')

// annoying popup an error box instead of silent console output
window.onerror = function (message, url, line) {
  window.alert('ERROR: \n' + message + ' (' + line + ')')
}

require('./stores/payments-store')

var appGUI = require('./ui/index.react')
window.onload = function () {
  appGUI.renderApp()
}

var blockManager = require('./lib/block-manager')

setTimeout(function () {
  blockManager.start().on('error', function (err) {
    if (err) alert.showError(err)
  })
}, 1000)
