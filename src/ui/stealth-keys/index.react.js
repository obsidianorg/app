// import { keydb } from '#keydb'
import { keys as keysActions } from '#flux/actions'
import { PDB } from '#pdb'
import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import swal from '#swal'
// import stealthPseudonym from '../../stealth-pseudonym'

const pdb = PDB

@connect((state) => ({ keys: state.keys }), () => ({ actions: { keys: keysActions } }))
export default class StealthKeyView extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    keys: React.PropTypes.array.isRequired
  }

  // TODO: upgrade to swal 1.1.0 to get progress on pdb.resolve (resolve should be async)
  // TODO: move pdb to a reducer
  handleClickStealthAdd = () => {
    swal.prompt({
      title: 'Register Pseudonym',
      confirmButtonText: 'Register',
      validate: function (val) {
        if (val.length < 4) return 'Must be at least 4 characters.'
        if (val.match(/\s/)) return 'Can NOT contain any spaces.'
        // could use style 'warning' here
        if (pdb.resolveSync(val)) return val + ' is already registered.'
      }
    }, (alias) => {
      swal.confirm({
        confirmButtonText: 'Register',
        cancelButtonText: 'Cancel Register',
        title: 'Register Pseudonym?',
        text: `Are you sure that you want to register '${alias}' at a a cost of 100 BLK?`
      }, (confirm) => {
        if (!confirm) return true
        this.props.actions.keys.registerAlias(alias)
      })
    })
  }

  render () {
    let keys = this.props.keys.map((key, i) => {
      return (
        <tr key={ i }>
          <td>{ key.alias }</td>
          <td>{ key.toString() }</td>
        </tr>
      )
    })

    return (
      <div id='stealth-key-view'>
        <Table style={{ borderBottom: '1px white solid' }}>
          <thead>
            <tr><th>Alias</th><th>Stealth Address</th></tr>
          </thead>
          <tbody>
            { keys }
          </tbody>
        </Table>
        <Button style={{ marginLeft: '8px' }} onClick={ this.handleClickStealthAdd }>Add</Button>
      </div>
    )
  }
}
