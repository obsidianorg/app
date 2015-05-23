var React = require('react')
var SidebarButton = require('./sidebar-button.react')

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  handleClickRegister: function () {
    window.alert('Not implemented yet.')
  },

  handleClickCopy: function () {

  },

  handleClickShowDevTools: function () {

  },

  render: function () {
    return (
      <aside>
        <div id='sidebar'>
          <ul className='sidebar-menu'>
            <li>
              <SidebarButton
                hoverText='Register Stealth Pseudonym'
                onClick={ this.handleClickRegister }
                icon='user-secret'/>
            </li>
            <li>
              <a title='Copy Stealth Address'>
                <i className='fa fa-share-alt'></i>
              </a>
            </li>
            <li>
              <a title='Show Developer Tools' >
                <i className='fa fa-wrench'></i>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    )
  }
})

module.exports = Sidebar
