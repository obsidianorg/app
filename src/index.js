require('./babel/hook')

require('./devtools')

// annoying popup an error box instead of silent console output
window.onerror = function (message, url, lineno, colno, error) {
  console.error(error)
  window.alert('ERROR: \n' + message + ' (' + lineno + ')' + '\n:' + error.stack)
}

require('./stores/payments-store')

var appGUI = require('./ui/index.react')
window.onload = function () {
  appGUI.renderApp()
}

var blockManager = require('./lib/block-manager')

setTimeout(function () {
  blockManager.start().on('error', function (err) {
    if (err) window.alert('ERROR: \n' + err)
  })
}, 1000)
