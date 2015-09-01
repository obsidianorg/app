import { keydb } from '#keydb'
import logger from '#logger'
import swal from '#swal'
import txUtils from '#txutils'

// TODO: move stealthPseudonym
import stealthPseudonym from '../../../lib/stealth-pseudonym'
// TODO: move blkqt
import blkqt from '../../../lib/blkqt'

export function load () {
  return (dispatch, getState) => {
    keydb.loadSync()
    dispatch({
      type: 'KEYS_LOAD',
      payload: keydb.keys
    })
  }
}

export function registerAlias (alias) {
  return (dispatch) => {
    let sk = keydb.addAlias(alias)

    // 100 => cost of 100 BLK
    stealthPseudonym.createRegistryTx(alias, sk, 100, function (err, tx) {
      if (err) {
        logger.error(err)
        return swal.error({ title: err.message, text: err.stack })
      }

      let hex = txUtils.serializeToHex(tx)
      logger.info('gonna registes alias with tx hex: ', { hex: hex })
      blkqt.submitTransaction(hex, function (err, txId) {
        if (err) {
          logger.error(err)
          return swal.error({ title: err.message, text: err.stack })
        }

        logger.info(`${alias} registered`, { hex: hex, txId: txId })
        keydb.saveSync()

        dispatch({
          type: 'KEYS_LOAD',
          payload: keydb.keys
        })
      })
    })
  }
}
