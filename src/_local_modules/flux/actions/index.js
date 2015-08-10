import { bindActionCreators } from 'redux'
import * as flux from '../'
import * as blockHeight from './block-height'
import * as keys from './keys'

export default {
  blockHeight: bindActionCreators(blockHeight, flux.store.dispatch),
  keys: bindActionCreators(keys, flux.store.dispatch)
}
