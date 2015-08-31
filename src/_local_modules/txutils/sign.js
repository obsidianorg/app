import async from 'async'
import CoinKey from 'coinkey'
import txUtils from './'

export function addInputsAndSign (tx, utxos, wifResolverFn, callback) {
  async.mapSeries(utxos, function (utxo, done) {
    tx.addInput(utxo.txId, utxo.vout)

    // from blkqt
    wifResolverFn(utxo.address, function (err, wif) {
      if (err) return done(err)
      var key = CoinKey.fromWif(wif)
      done(null, key)
    })
  }, signInputs)

  function signInputs (err, keys) {
    if (err) return callback(err)
    for (var i = 0; i < utxos.length; ++i) {
      var key = keys[i]
      txUtils.sign(tx, i, key)
    }

    // all done
    callback(null, tx)
  }
}
