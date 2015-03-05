var React = require('react')
var _ = require('lodash')
var AccountActions = require('../actions/account-actions')

var SendForm = React.createClass({
  getInitialState: function() {
    return {
      receiver: '',
      amount: 0.0
    }
  },

  handleAmountChange: function(event) {
    this.setState({
      amount: event.target.value
    })
  },

  handleReceiverChange: function(event) {
    this.setState({
      receiver: event.target.value
    })
  },

  handleSend: function() {
    var data = _.assign({}, this.state)
    console.log('sending')
    console.log(JSON.stringify(data, null, 2))
    //AccountActions.send(data)
    this.setState(this.getInitialState())
  },

  render: function() {
    var formStyle = {
      padding: '10px'
    }

    return (
      <form style={formStyle}>
        <div className="form-group">
          <label htmlFor="receiver">Receiver:</label>
          <input type="text" id="receiver" onChange={ this.handleReceiverChange } className="form-control input-lg" placeholder="(stealth address)"/>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <div className="input-group input-group-lg">
            <input type="text" id="amount" className="form-control" onChange={ this.handleAmountChange } placeholder="amount" />
            <span className="input-group-addon">BLK</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-lg" onClick={ this.handleSend }>Send</button>
      </form>
    )
  }
})

module.exports = SendForm
