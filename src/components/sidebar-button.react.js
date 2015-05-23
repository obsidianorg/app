var React = require('react')

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

    return (
      <a title={ this.props.hoverText } onClick={ this.props.onClick }>
        <i className={ classString }></i>
      </a>
    )
  }
})

module.exports = SidebarButton
