var clipboard = require('clipboard')
var remote = require('remote')
var React = require('react')
var SidebarButton = require('./sidebar-button.react')
var PseudonymModal = require('../pseudonym-modal.react')
import * as stealth from '@keydb'
var userLang = require('../../lib/lang').getLanguage()
var lang = require('../../common/lang').getLanguageData(userLang).getContext('send-form')
var ModalTrigger = require('react-bootstrap').ModalTrigger

// todo, refactor
import window from '@domwindow'
var localStorage = window.localStorage

// only onefor now
var sk = stealth.load()

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  getInitialState: function () {
    return {
      registerButtonVisible: !localStorage.pseudonym
    }
  },

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

  handlePseudonymRegistered: function () {
    this.setState({
      registerButtonVisible: false
    })
  },

  render: function () {
    // this might be the wrong way to do this...
    var registerButton = this.state.registerButtonVisible
      ? <li>
          <ModalTrigger modal={ <PseudonymModal handlePseudonymRegistered={ this.handlePseudonymRegistered } /> }>
            <SidebarButton
              hoverText='Register Stealth Pseudonym'
              icon='user-plus'/>
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
                icon='clipboard'/>
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
