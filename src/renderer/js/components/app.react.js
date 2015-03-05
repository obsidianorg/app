var React = require('react')
var Sidebar = require('./sidebar.react')
var Accounts = require('./accounts.react')
var Header = require('./header.react')
var AccountStore = require('../stores/accounts-store')
var AccountActions = require('../actions/account-actions')
var SendForm = require('./send-form.react')

function getAccountsState() {
  return {
    accounts: AccountStore.accounts
  }
}

var App = React.createClass({
  getInitialState: function() {
    AccountActions.sync()
    return getAccountsState()
  },

  componentDidMount: function() {
    AccountStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    AccountStore.removeChangeListener(this._onChange)
  },


  render: function() {
    return (
      <div id="container" >
        <Sidebar />

        <section id="main-content">
          <Header />
          <SendForm />
          {/* <Accounts data={ this.state.accounts }/> */}
        </section>
      </div>
    )
  },

  _onChange: function() {
    this.setState(getAccountsState())
  }
})

module.exports = App
