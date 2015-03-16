var React = require('react')
var Sidebar = require('./sidebar.react')
var Header = require('./header.react')
var SendForm = require('./send-form.react')
var PaymentStore = require('../stores/payments-store')

var App = React.createClass({
  getInitialState: function() {
    return null
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },


  render: function() {
    return (
      <div id="container" >
        <Sidebar />

        <section id="main-content">
          <Header />
          <SendForm />
        </section>
      </div>
    )
  },

  _onChange: function() {
  }
})

module.exports = App
