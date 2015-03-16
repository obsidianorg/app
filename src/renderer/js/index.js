// please STFU React with your devtools suggestion
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}

var alert = require('./lib/alert')

// annoying popup an error box instead of silent console output
window.onerror = function(message, url, line) {
  alert.showError(message + ' (' + line + ')')
}

var React = require('react')
var App = require('./components/app.react')
var blockChecker = require('./lib/block-checker')

window.onload = function() {
  React.render(
    <App/>,
    document.querySelector('.app')
  )
}

setTimeout(function() {
  blockChecker.init(function(err) {
    if (err) alert.showError(err)
  })
}, 1000)
