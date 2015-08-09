var React = require('react')
var App = require('./app.react.js')

function renderApp () {
  React.render(<App/>, document.body)
}

module.exports = {
  renderApp: renderApp
}
