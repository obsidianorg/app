import React from 'react'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'

@connect((state) => ({ keys: state.keys }))
export default class StealthKeyView extends React.Component {
  static propTypes = {
    keys: React.PropTypes.array.isRequired
  }

  render () {
    let keys = this.props.keys.map((key, i) => {
      return (
        <tr key={ i }>
          <td>{ key.alias }</td>
          <td>{ key.stealth.toString() }</td>
        </tr>
      )
    })

    return (
      <div id='stealth-key-view'>
        <Table>
          <thead>
            <tr><th>Alias</th><th>Stealth Address</th></tr>
          </thead>
          <tbody>
            { keys }
          </tbody>
        </Table>
      </div>
    )
  }
}
