var clipboard = require('clipboard')
var remote = require('remote')
var React = require('react')
var SidebarButton = require('./sidebar-button.react')
var stealth = require('../db/keydb')
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
    remote.getCurrentWindow().toggleDevTools()
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
              <SidebarButton
                hoverText='Show Developer Tools'
                onClick={ this.handleClickShowDevTools }
                icon='wrench'/>
            </li>
          </ul>
        </div>
      </aside>
    )
  }
})

module.exports = Sidebar
