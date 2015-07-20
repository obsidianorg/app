import clipboard from 'clipboard'
import { ModalTrigger } from 'react-bootstrap'
import remote from 'remote'
import * as stealth from '@keydb'
import React from 'react'
import window from '@domwindow'
import SidebarButton from './sidebar-button.react'
import DeregisterSidebarButton from './deregister-sidebar-button.react'
import PseudonymModal from '../pseudonym-modal.react'

var userLang = require('../../lib/lang').getLanguage()
var lang = require('../../common/lang').getLanguageData(userLang).getContext('send-form')

// only onefor now
var sk = stealth.load()
var pseudonym = stealth.getCurrentP()

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  getInitialState: function () {
    return {
      registerButtonVisible: !pseudonym
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
      : <li>
          <DeregisterSidebarButton />
        </li>

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
