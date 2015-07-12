var React = require('react')
var {OverlayTrigger, Tooltip} = require('react-bootstrap')

var SidebarButton = React.createClass({
  displayName: 'SidebarButton',

  getDefaultProps: function () {
    return {
      onClick: Function()
    }
  },

  propTypes: {
    onClick: React.PropTypes.func,
    hoverText: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  render: function () {
    var classString = 'fa fa-' + this.props.icon

    var toolTip = <Tooltip>{ this.props.hoverText }</Tooltip>

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

module.exports = SidebarButton
