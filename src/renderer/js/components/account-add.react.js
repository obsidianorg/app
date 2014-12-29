var React = require('react')
var OverlayTrigger = require('react-bootstrap').OverlayTrigger
var Popover = require('react-bootstrap').Popover
var AccountActions = require('../actions/account-actions')

AccountAdd = React.createClass({
  getInitialState: function() {
    return {
      name: ''
    }
  },

  handleKeyDown: function(event) {
    if (event.keyCode !== 13) return
    if (!this.state.name.trim()) return
    this.refs['accountAddPopover'].hide()

    AccountActions.create(this.state.name)
    
    this.setState({
      name: ''
    })
  },

  handleChange: function(event) {
    this.setState({
      name: event.target.value
    })
  },

  render: function() {
    var popover = <Popover title="Add Account">
      <input onChange={this.handleChange} ref="nameInput" onKeyDown={this.handleKeyDown} value={this.state.name} />
    </Popover>

    return (
      <OverlayTrigger trigger="click" placement="left" ref="accountAddPopover" overlay={popover}>
        <a href="#" className="top-plus">
          <i className="fa fa-plus-square"></i>
        </a>
      </OverlayTrigger>
    )
  }
})

module.exports = AccountAdd
