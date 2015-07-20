import React from 'react'
import swal from '@swal'
import SidebarButton from './sidebar-button.react'
import stealthPseudonym from '../../lib/stealth-pseudonym'
import * as pdb from '../../db/pdb'
import logger from '../../logger'
import alert from '../alert'
import PaymentActions from '../../actions/payment-actions'

// temporary
import * as stealth from '@keydb'
var sk = stealth.load()
var pseudonym = stealth.getCurrentP()
var PDB = pdb.PDB

const component = React.createClass({
  displayName: 'DeregisterSidebarButton',

  handleClick () {
    let title = `Deregister ${pseudonym}?`
    let text = `Are you sure that you want to deregister ${pseudonym}? The coins will be transfered back to your wallet.`
    swal.confirm({ title, text, confirmButtonText: 'Deregister' }, function (confirmPressed) {
      if (!confirmPressed) return
      let data = PDB.resolveSync(pseudonym)

      stealthPseudonym.createDeregistryTx(pseudonym, sk, data.txId, function (err, tx) {
        if (err) {
          logger.error(err)
          return alert.showError(err)
        }

        PaymentActions.send({tx: tx})
        logger.info(pseudonym + ' deregistered')
        window.alert(pseudonym + ' deregistered!')

      })

    })
  },

  render () {
    return (
      <SidebarButton
        hoverText='Deregister Stealth Pseudonym'
        icon='minus-circle'
        onClick={ this.handleClick }
      />
    )
  }
})

export default component
