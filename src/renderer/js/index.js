var React = require('react')
var App = require('./components/app.react')

window.onload = function() {
  React.render(
    <App/>,
    document.querySelector('.app')
  ) 
}
