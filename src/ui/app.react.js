var React = require('react')
var Sidebar = require('./sidebar')
var Header = require('./header.react')
var SendForm = require('./send-form.react')

var App = React.createClass({
  displayName: 'App',

  render: function () {
    return (
      <div id='container' >
        <Sidebar />

        <section id='main-content'>
          <Header />
          <SendForm />
        </section>
      </div>
    )
  }
})

module.exports = App
