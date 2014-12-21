var React = require('react')
var AccountItem = require('./account-item.react')

var Accounts = React.createClass({
  render: function() {
    var accounts = []

    for (var key in this.props.data) {
      accounts.push(<AccountItem key={ key } account={ this.props.data[key] } />)
    }

    return (
      <section className="wrapper">
        { accounts }
      </section>
    )
  }
})

module.exports = Accounts
