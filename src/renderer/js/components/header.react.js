var React = require('react')
var AccountActions = require('../actions/account-actions')

var Header = React.createClass({
  _onCreate: function() {
    //todo: replace with better input
    var name = prompt('Name of account?')

    //make sure something was entered
    if (name.trim())
      AccountActions.create(name)
  },

  render: function() {
    return (
      <header className="header">
        <div className="text-center">
          Accounts
          <a href="index.html#" className="top-plus">
            <i className="fa fa-plus-square" onClick={ this._onCreate }></i>
          </a>
        </div>
      </header>
    )
  }
})

module.exports = Header
