import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const SidebarButton = React.createClass({
  displayName: 'SidebarButton',

  getDefaultProps () {
    return {
      onClick: Function()
    }
  },

  propTypes: {
    onClick: React.PropTypes.func,
    hoverText: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  render () {
    let classString = 'fa fa-' + this.props.icon
    let toolTip = <Tooltip>{ this.props.hoverText }</Tooltip>

    return (
      <OverlayTrigger placement='right' overlay={toolTip}>
        {/* <a {title={ this.props.hoverText } onClick={ this.props.onClick }>*/}
        <a onClick={ this.props.onClick }>
          <i className={ classString }></i>
        </a>
      </OverlayTrigger>
    )
  }
})

export default SidebarButton
