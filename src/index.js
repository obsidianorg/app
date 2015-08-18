require('./babel/hook')
require('./devtools')

var remote = require('remote')
var remoteConsole = remote.require('console')

console.log = function () {
  remoteConsole.log.apply(remoteConsole, arguments)
}

console.dir = function () {
  remoteConsole.dir.apply(remoteConsole, arguments)
}

console.error = function () {
  remoteConsole.error.apply(remoteConsole, arguments)
}

// annoying popup an error box instead of silent console output
window.onerror = function (message, url, lineno, colno, error) {
  console.error(error)
  console.error(error.stack)
  window.alert('ERROR: \n' + message + ' (' + lineno + ')' + '\n:' + error.stack)
}

require('./stores/payments-store')

document.addEventListener('DOMContentLoaded', function () {
  require('./ui/index.react').renderApp()
})

require('./startup').run()
