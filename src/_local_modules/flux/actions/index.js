import { bindActionCreators } from 'redux'
import * as flux from '../'
import * as blockHeight from './block-height'

export default {
  blockHeight: bindActionCreators(blockHeight, flux.store.dispatch)
}
