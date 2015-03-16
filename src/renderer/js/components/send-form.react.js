var util = require('util')
var accounting = require('@common/accounting')
var React = require('react')
var _ = require('lodash')
var alert = require('../lib/alert')
var atom = require('../atom')
var PaymentActions = require('../actions/payment-actions')
var stealthPayment = require('../lib/stealth-payment')
var stealth = require('../lib/stealth')

// only onefor now
var sk = stealth.load()

var SendForm = React.createClass({
  getInitialState: function() {
    return {
      receiver: '',
      amount: ''
    }
  },

  handleAmountChange: function(event) {
    this.setState({
      amount: event.target.value
    })
  },

  handleCopy: function(event) {
    atom.clipboard.writeText(sk.toString())
    console.log(sk + ' copied')
  },

  handleReceiverChange: function(event) {
    this.setState({
      receiver: event.target.value
    })
  },

  handleSend: function() {
    var self = this
    var data = _.cloneDeep(this.state)

    stealthPayment.prepareSend(data, function(err, data) {
      if (err) return alert.showError(err)

      // for logging
      // todo, develop better logging strategy
      console.log(JSON.stringify(data, null, 2))

      var dlgOpts = {
        buttons: ['Send', "Don't send"],
        title: 'Send?',
        message: util.format('Send %s with a fee of %s?', accounting.fm(data.amounts.send), accounting.fm(data.amounts.fee))
      }

      atom.dialog.showMessageBox(null, dlgOpts, function(buttonIdx) {
        // send pressed
        if (buttonIdx === 0) {
          stealthPayment.createTx(data, function(err, tx) {
            if (err) return alert.showError(err)
            PaymentActions.send({tx: tx})
            atom.dialog.showMessageBox(null, {buttons: ['OK'], title: 'Sent', message: 'Sent!'}, function(){})
            self.setState(self.getInitialState())
          })
        }
      })
    })
  },

  render: function() {
    var formStyle = {
      padding: '10px'
    }

    return (
      <form style={formStyle}>
        <div className="form-group">
          <label htmlFor="receiver">Receiver:</label>
          <input type="text" id="receiver" onChange={ this.handleReceiverChange } className="form-control input-lg" placeholder="(stealth address)" value={ this.state.receiver }/>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <div className="input-group input-group-lg">
            <input type="text" id="amount" className="form-control" onChange={ this.handleAmountChange } placeholder="(amount in BLK)" value={ this.state.amount }/>
            <span className="input-group-addon">BLK</span>
          </div>
        </div>
        <button type="button" className="btn btn-lg" onClick={ this.handleSend } style={{marginRight: '1.5rem'}}>Send Payment</button>
        <button type="button" className="btn btn-lg" onClick={ this.handleCopy }>Copy Stealth Address</button>
      </form>
    )
  }
})

module.exports = SendForm
