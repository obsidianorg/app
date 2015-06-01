var React = require('react')
var Modal = require('react-bootstrap').Modal
var Button = require('react-bootstrap').Button
var Input = require('react-bootstrap').Input

const PseudonymModal = React.createClass({
  displayName: 'PseudonymModal',

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
    this.props.onRequestHide()
  },

  propTypes: function () {
    return {
      onRequestHide: React.PropTypes.Func
    }
  },

  validate: function () {
    var val = this.state.value

    // default when modal opens
    if (val.length === 0) return { style: undefined, message: '' }
    if (val.length < 4) return { style: 'error', message: 'Must be at least 4 characters.' }
    if (val.match(/\s/)) return { style: 'error', message: 'Can NOT contain any spaces.' }

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
          <Button onClick={ this.handleRegisterClicked }>Register</Button>
        </div>
      </Modal>
    )
  }
})

module.exports = PseudonymModal
