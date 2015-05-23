var util = require('util')
var React = require('react')
var _ = require('lodash')
var accounting = require('../common/accounting')
var alert = require('../lib/alert')
var atom = require('../atom')
var PaymentActions = require('../actions/payment-actions')
var stealthPayment = require('../lib/stealth-payment')
var userLang = require('../lib/lang').getLanguage()
var lang = require('../common/lang').getLanguageData(userLang).getContext(__filename)

var SendForm = React.createClass({
  displayName: 'SendForm',

  getInitialState: function () {
    return {
      receiver: '',
      amount: ''
    }
  },

  handleAmountChange: function (event) {
    this.setState({
      amount: event.target.value
    })
  },

  handleReceiverChange: function (event) {
    this.setState({
      receiver: event.target.value
    })
  },

  handleSend: function () {
    var self = this
    var data = _.cloneDeep(this.state)
    data.receiver = data.receiver.trim()

    stealthPayment.prepareSend(data, function (err, data) {
      if (err) return alert.showError(err)

      // for logging
      // todo, develop better logging strategy
      console.log(JSON.stringify(data, null, 2))

      var dlgOpts = {
        buttons: lang.sendMB.buttons,
        title: lang.sendMB.title,
        message: util.format(lang.sendMB.message, accounting.fm(data.amounts.send), accounting.fm(data.amounts.fee))
      }

      atom.dialog.showMessageBox(null, dlgOpts, function (buttonIdx) {
        // send pressed
        if (buttonIdx === 0) {
          stealthPayment.createTx(data, function (err, tx) {
            if (err) return alert.showError(err)
            PaymentActions.send({tx: tx})
            atom.dialog.showMessageBox(null, lang.sentMB, Function())
            self.setState(self.getInitialState())
          })
        }
      })
    })
  },

  handleShowDebug: function () {
    atom.remote.getCurrentWindow().openDevTools()
  },

  render: function () {
    var formStyle = {
      padding: '10px'
    }

    return (
      <form style={formStyle}>
        <div className='form-group'>
          <label htmlFor='receiver'>{ lang.receiverLabel }</label>
          <input type='text'
            id='receiver'
            onChange={ this.handleReceiverChange }
            className='form-control input-lg'
            placeholder={ lang.receiverPlaceholder }
            value={ this.state.receiver }/>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>{ lang.amountLabel }</label>
          <div className='input-group input-group-lg'>
            <input
              type='text'
              id='amount'
              className='form-control'
              onChange={ this.handleAmountChange }
              placeholder={ lang.amountPlaceholder }
              value={ this.state.amount }/>
            <span className='input-group-addon'>BLK</span>
          </div>
        </div>
        <button type='button' className='btn btn-lg'
          onClick={ this.handleSend }
          style={{marginRight: '1.2rem', width: '220px'}}>
          { lang.sendButton }
        </button>
        <button type='button' className='btn btn-lg'
          onClick={ this.handleShowDebug }
          style={{marginRight: '1.2rem', width: '220px'}}>
          Show test hello
        </button>
      </form>
    )
  }
})

module.exports = SendForm
