var React = require('react')
var Button = require('react-bootstrap').Button
var OverlayTrigger = require('react-bootstrap').OverlayTrigger
var Popover = require('react-bootstrap').Popover
var _ = require('lodash')
var AccountActions = require('../actions/account-actions')

var getInitialState = function() {
  return {
    address: '',
    amount: 0.0
  }
}

var AccountSend = React.createClass({
  getInitialState: function() {
    return getInitialState()
  },

  handleAmountChange: function(event) {
    this.setState({
      amount: event.target.value
    })
  },

  handleAddressChange: function(event) {
    this.setState({
      address: event.target.value
    })
  },

  handleSend: function(event) {
    var data = _.assign({}, this.state)
    data.account = this.props.account
    AccountActions.send(data)
    this.refs['accountSendPopover'].hide()
    this.setState(getInitialState())
  },

  render: function() {
    var popover = <Popover title="Add Account">
      <input onChange={this.handleAddressChange} ref="addressInput" value={this.state.address} />
      <input onChange={this.handleAmountChange} ref="amountInput" value={this.state.amount} />
      <div>
        <Button bsSize="xsmall" bsStyle="success" onClick={this.handleSend}>Send</Button>
      </div>
    </Popover>

    return (
      <OverlayTrigger trigger="click" placement="bottom" ref="accountSendPopover" overlay={popover}>
        <Button bsSize="small" bsStyle="primary">Send</Button>
      </OverlayTrigger>
    )
  }
})

module.exports = AccountSend
