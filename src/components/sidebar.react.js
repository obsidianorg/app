var clipboard = require('clipboard')
var React = require('react')
var SidebarButton = require('./sidebar-button.react')
var stealth = require('../lib/stealth')
var userLang = require('../lib/lang').getLanguage()
var lang = require('../common/lang').getLanguageData(userLang).getContext('send-form')

// only onefor now
var sk = stealth.load()

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  handleClickRegister: function () {
    window.alert('Not implemented yet.')
  },

  handleClickCopy: function () {
    clipboard.writeText(sk.toString())
    console.log(sk + ' copied')
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
              <SidebarButton
                hoverText={ lang.copyButton }
                onClick={ this.handleClickCopy }
                icon='share-alt'/>
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
