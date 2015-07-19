var React = require('react')
var Modal = require('react-bootstrap').Modal
var Button = require('react-bootstrap').Button
var Input = require('react-bootstrap').Input
var alert = require('./alert')
var logger = require('../logger')
var PaymentActions = require('../actions/payment-actions')
var stealthPseudonym = require('../lib/stealth-pseudonym')
var pdb = require('../db/pdb').PDB // temporary hack
import * as stealth from '@keydb'

import window from '@domwindow'
var localStorage = window.localStorage

// already init'd in index.js/blockManager (this is hacky to rely upon that, TODO, fix)

// only onefor now
var sk = stealth.load()

const PseudonymModal = React.createClass({
  displayName: 'PseudonymModal',

  getDefaultProps: function () {
    return {
      handlePseudonymRegistered: Function()
    }
  },

  getInitialState: function () {
    return {
      value: ''
    }
  },

  handlePseudonymChange: function () {
    this.setState({value: this.refs.pseudonym.getValue()})
  },

  handleCancelClicked: function () {
    this.props.onRequestHide()
  },

  handleRegisterClicked: function () {
    var dlgOpts = {
      buttons: [
        'Register',
        'Cancel Register'
      ],
      title: 'Register Pseudonym?',
      message: 'Are you sure that you want to register ' + this.state.value + ' at a a cost of 100 BLK?'
    }

    var self = this
    var pseudonym = this.state.value

    alert.showMessageBox(null, dlgOpts, function (buttonIdx) {
      // check if register pressed
      if (buttonIdx !== 0) return

      stealthPseudonym.createRegistryTx(pseudonym, sk, 100, function (err, tx) {
        if (err) {
          logger.error(err)
          return alert.showError(err)
        }

        PaymentActions.send({tx: tx})
        logger.info(pseudonym + ' registered')
        window.alert(pseudonym + ' registered!')

        localStorage.pseudonym = pseudonym

        self.props.handlePseudonymRegistered()
        self.props.onRequestHide()
      })
    })
  },

  propTypes: function () {
    return {
      handlePseudonymRegistered: React.PropTypes.Func,
      onRequestHide: React.PropTypes.Func
    }
  },

  validate: function () {
    var val = this.state.value

    // default when modal opens
    if (val.length === 0) return { style: undefined, message: '' }
    if (val.length < 4) return { style: 'error', message: 'Must be at least 4 characters.' }
    if (val.match(/\s/)) return { style: 'error', message: 'Can NOT contain any spaces.' }

    // could use style 'warning' here
    if (pdb.resolveSync(val)) return { style: 'error', message: val + ' already is registered.' }

    return { style: 'success', message: '' }
  },

  render: function () {
    var validationResult = this.validate()

    return (
      <Modal {...this.props} bsSize='small' title='Register Pseudonym' animation={true}>
        <div className='modal-body'>
          <form>
            <Input
              type='text'
              value={ this.state.value }
              placeholder='(Enter pseudonym)'
              label=''
              help={ validationResult.message }
              bsStyle={ validationResult.style }
              hasFeedback
              ref='pseudonym'
              groupClassName='group-class'
              labelClassName='label-class'
              onChange={ this.handlePseudonymChange } />
          </form>
        </div>
        <div className='modal-footer'>
          <Button onClick={ this.handleCancelClicked }>Cancel</Button>
          {
            validationResult.style === 'success'
              ? <Button onClick={ this.handleRegisterClicked }>Register</Button>
              : <Button disabled>Register</Button>
          }
        </div>
      </Modal>
    )
  }
})

module.exports = PseudonymModal
