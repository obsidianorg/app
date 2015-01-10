// please STFU React with your devtools suggestion
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}

var React = require('react')
var App = require('./components/app.react')

window.onload = function() {
  React.render(
    <App/>,
    document.querySelector('.app')
  ) 
}
