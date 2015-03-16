// please STFU React with your devtools suggestion
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}

var alert = require('./lib/alert')

// annoying popup an error box instead of silent console output
window.onerror = function(message, url, line) {
  alert.showError(message + ' (' + line + ')')
}

var React = require('react')
var App = require('./components/app.react')

window.onload = function() {
  React.render(
    <App/>,
    document.querySelector('.app')
  )
}

// todo: move
var blkqt = require('./lib/blkqt')
var LS_KEY = 'lastBlockCount'
setTimeout(function() {
  if (window.localStorage.getItem(LS_KEY)) return

  blkqt.getBlockCount(function(err, bc) {
    window.localStorage.setItem(LS_KEY, bc)
  })
}, 500)