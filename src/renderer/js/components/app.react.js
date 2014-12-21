var React = require('react')
var Sidebar = require('./sidebar.react')
var Accounts = require('./accounts.react')
var Header = require('./header.react')
var AccountStore = require('../stores/accounts-store')

function getAccountsState() {
  return {
    accounts: AccountStore.accounts
  }
}

var App = React.createClass({
  getInitialState: function() {
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
          <Accounts data={ this.state.accounts }/>
        </section>
      </div>
    )
  },

  _onChange: function() {
    this.setState(getAccountsState())
  }
})

module.exports = App
