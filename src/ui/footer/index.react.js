import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default class Footer extends React.Component {
  render () {
    return (
      <div id='footer'>
        <ProgressBar now={45} label='Syncing block %(percent)s' bsStyle='warning' />
      </div>
    )
  }
}
