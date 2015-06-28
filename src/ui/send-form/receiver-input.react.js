var {Input} = require('react-bootstrap')
var React = require('react')
var Stealth = require('stealth')
var pdb = require('../../db/pdb').PDB // temporary hack
var userLang = require('../../lib/lang').getLanguage()
var lang = require('../../common/lang').getLanguageData(userLang).getContext('send-form.react.js')

var ReceiverInput = React.createClass({
  displayName: 'ReceiverInput',

  getDefaultProps () {
    return {
      onChange: Function()
    }
  },

  getInitialState () {
    return {
      value: '',
      validation: this.validate('')
    }
  },

  handleChange (event) {
    var value = event.target.value.trim()
    this.setState({
      value: value,
      validation: this.validate(value)
    })
    this.props.onChange(event)
  },

  propTypes: {
    onChange: React.PropTypes.func
  },

  render () {
    return (
      <Input
        type='text'
        value={ this.state.value }
        placeholder={ lang.receiverPlaceholder }
        label={ lang.receiverLabel }
        help={ this.state.validation.message }
        bsStyle={ this.state.validation.style }
        bsSize='large'
        hasFeedback
        ref='receiver'
        groupClassName='group-class'
        labelClassName='label-class'
        onChange={ this.handleChange }
      />
    )
  },

  validate (receiver) {
    // default when modal opens
    if (receiver.length === 0) {
      return {
        style: undefined,
        message: 'Enter in stealth or pseudonym...'
      }
    }

    var stealth
    try {
      stealth = Stealth.fromString(receiver)
    } catch (x) {}

    // a stealth address was entered
    if (stealth) {
      if (stealth.version !== 39) {
        return {
          style: 'error',
          message: 'Incorrect BlackCoin stealth version number.'
        }
      } else {
        return {
          style: 'success',
          message: 'Valid stealth address.'
        }
      }
    }

    // a pseudonym was entered
    var pdata = pdb.resolveSync(receiver)
    if (!pdata) {
      return {
        style: 'error',
        message: 'Invalid stealth address or pseudonym.'
      }
    }

    return {
      style: 'success',
      message: 'Resolves to: ' + pdata.stealth
    }
  }
})

module.exports = ReceiverInput
