var clipboard = require('clipboard')
var remote = require('remote')
var React = require('react')
var SidebarButton = require('./sidebar-button.react')
var PseudonymModal = require('./pseudonym-modal.react')
var stealth = require('../db/keydb')
var userLang = require('../lib/lang').getLanguage()
var lang = require('../common/lang').getLanguageData(userLang).getContext('send-form')
var ModalTrigger = require('react-bootstrap').ModalTrigger

// todo, refactor
var localStorage = require('../domwindow').localStorage

// only onefor now
var sk = stealth.load()

var registerButtonVisible = !localStorage.pseudonym

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
    // this might be the wrong way to do this...
    var registerButton = registerButtonVisible
      ? <li>
          <ModalTrigger modal={ <PseudonymModal/> }>
            <SidebarButton
              hoverText='Register Stealth Pseudonym'
              icon='user-secret'/>
          </ModalTrigger>
        </li>
      : <span></span>

    return (
      <aside>
        <div id='sidebar'>
          <ul className='sidebar-menu'>
            { registerButton }
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
