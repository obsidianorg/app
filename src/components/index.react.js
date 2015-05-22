var React = require('react')
var App = require('./app.react.js')

function renderApp () {
  React.render(
    <App/>,
    document.querySelector('.app')
  )
}

module.exports = {
  renderApp: renderApp
}
