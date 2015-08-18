var {Input} = require('react-bootstrap')
var DropdownMenu = require('./DropdownMenu.react')
var React = require('react')
var Stealth = require('stealth')
var pdb = require('../../db/pdb').PDB // temporary hack
var userLang = require('../../lib/lang').getLanguage()
var lang = require('../../common/lang').getLanguageData(userLang).getContext('send-form.react.js')

var ReceiverInput = React.createClass({
  displayName: 'ReceiverInput',

  getDefaultProps () {
    return {
      onChange: function () {}
    }
  },

  getInitialState () {
    return {
      matchResults: [],
      value: '',
      validation: this.validate('')
    }
  },

  handleKeyUp (event) {
    if (event.key === 'ArrowDown' && this.state.matchResults.length > 0) {
      // console.log('FOCUS')
      // React.findDOMNode(this.refs.input).blur()
      React.findDOMNode(this.refs.menuItem0).focus()
    }
  },

  handleChange (event) {
    var value = event.target.value.trim()
    this.setState({
      matchResults: pdb.matchSync(value).slice(0, 5).sort((a, b) => a.toLowerCase() > b.toLowerCase()),
      value: value,
      validation: this.validate(value)
    })
    this.props.onChange(value)
  },

  propTypes: {
    onChange: React.PropTypes.func
  },

  render () {
    var matchResults = this.state.matchResults.map(function (item, i) {
      return (
        <li role='presentation' key={ i } className='item'>
          <a
            role='menuitem'
            href='#'
            tabIndex='-1'
            ref={'menuItem' + i}
            onClick={() => { this.setState({ value: item, matchResults: [], validation: this.validate(item) }); this.props.onChange(item) } }
          >
            { item }
          </a>
        </li>
      )

      /* return (
        <MenuItem key={ i } onClick={() => this.setState({ value: item, matchResults: [], validation: this.validate(item) })}>
          { item }
        </MenuItem>
      )*/
    }, this)

    var cls = 'dropdown '
    if (this.state.matchResults.length > 0) cls += 'open'

    return (
      <div className={ cls }>
        <Input
          type='text'
          value={ this.state.value }
          placeholder={ lang.receiverPlaceholder }
          label={ lang.receiverLabel }
          bsStyle={ this.state.validation.style }
          bsSize='large'
          hasFeedback
          ref='input'
          help={ this.state.validation.message }
          groupClassName='group-class'
          labelClassName='label-class'
          onChange={ this.handleChange }
          onKeyDown={ this.handleKeyUp }
        />
        <DropdownMenu ref='menu'>
          { matchResults }
        </DropdownMenu>
      </div>
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
