var React = require('react')
var AccountSend = require('./account-send.react')

var AccountItem = React.createClass({
  displayName: 'AccountItem',

  propTypes: {
    account: React.PropTypes.object
  },

  render: function () {
    var account = this.props.account

    return (
      <div className='panel' key={ account.id }>
        <h4><i className='fa fa-angle-right'></i> { account.label }</h4>
        <div className='data'>
          <span>{ account.address }</span>
          <span className='pull-right'>{ account.balance } BLK</span>
        </div>
        <div>
          <AccountSend account={this.props.account} />
        </div>
      </div>
    )
  }
})

module.exports = AccountItem
