import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from 'react-bootstrap'
import { blockHeightPercentSelector } from '#flux/selectors/block-height-percent'

@connect(state => ({ blockHeight: state.blockHeight }))
@connect(state => ({ percent: blockHeightPercentSelector(state) }))
export default class Footer extends React.Component {
  static propTypes = {
    percent: React.PropTypes.number,
    blockHeight: React.PropTypes.object
  }

  render () {
    let label = `Syncing block ${this.props.blockHeight.current} / ${this.props.blockHeight.top}`

    return this.props.percent < 100
      ? (
          <div id='footer'>
            <ProgressBar now={ this.props.percent } label={ label } />
          </div>
        )
      : null
  }
}
