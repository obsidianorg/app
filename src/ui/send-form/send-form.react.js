var util = require('util')
var React = require('react')
var _ = require('lodash')
var accounting = require('../../common/accounting')
var alert = require('../alert')
var PaymentActions = require('../../actions/payment-actions')
var stealthPayment = require('../../lib/stealth-payment')
var userLang = require('../../lib/lang').getLanguage()
var lang = require('../../common/lang').getLanguageData(userLang).getContext(__filename)
var pdb = require('../../db/pdb').PDB // temporary hack
var Stealth = require('stealth')
var ReceiverInput = require('./receiver-input.react')

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

  handleReceiverChange: function (receiver) {
    this.setState({
      receiver: receiver
    })
  },

  handleSend: function () {
    var self = this
    var data = _.cloneDeep(this.state)
    data.receiver = data.receiver.trim()

    // if pseudonym, conver to stealth
    var s
    try {
      s = Stealth.fromString(data.receiver)
    } catch (x) {}

    // it was a pseudonym
    if (!s) {
      data.receiver = pdb.resolveSync(data.receiver).stealth
    }

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

      alert.showMessageBox(null, dlgOpts, function (buttonIdx) {
        // send pressed
        if (buttonIdx === 0) {
          stealthPayment.createTx(data, function (err, tx) {
            if (err) return alert.showError(err)
            PaymentActions.send({tx: tx})
            alert.showMessageBox(null, lang.sentMB, Function())
            self.setState(self.getInitialState())
          })
        }
      })
    })
  },

  render: function () {
    var formStyle = {
      padding: '10px'
    }

    return (
      <form style={formStyle} id='#send-form'>
        <ReceiverInput onChange={ this.handleReceiverChange }/>
        <div className='form-group' style={{marginTop: '25px'}}>
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
          style={{marginRight: '1.2rem', marginTop: '1.5rem', width: '220px'}}>
          { lang.sendButton }
        </button>
      </form>
    )
  }
})

module.exports = SendForm
