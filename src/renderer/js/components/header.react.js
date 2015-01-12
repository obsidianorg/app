var React = require('react')
var AccountAdd = require('./account-add.react')

var Header = React.createClass({
  render: function() {
    return (
      <header className="header">
        <div className="text-center">
          Accounts
        </div>
      </header>
    )
  }
})

module.exports = Header
