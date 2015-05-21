var assert = require('assert')
var async = require('async')
var ci = require('coininfo')
var cointx = require('cointx')
var Decimal = require('decimal.js')
var blkqt = require('../lib/blkqt')
var txUtils = require('../blockchain/txutils')
var Script = cointx.Script
var Transaction = cointx.Transaction
var BLK_INFO = ci('BLK')

var cc = require('@common/cryptocoin').create()

function createRegistryTx (pseudonym, stealthKey, callback) {
  assert(typeof pseudonym, 'pseudonym must be a string')
  assert(stealthKey, 'Must pass in stealthKey')

  var registryAmountBLK = 300

  var tx = new Transaction()
  txUtils.setCurrentTime(tx)

  var opReturnData = new Buffer('_OPRG:' + pseudonym, 'utf8')
  var opReturnScript = Script.fromASM('OP_RETURN ' + opReturnData.toString('hex'))

  var payloadOutScript = Script.fromASM(stealthKey.payloadPubKey.toString('hex') + ' OP_CHECKSIG')
  var scanOutScript = Script.fromASM(stealthKey.scanPubKey.toString('hex') + ' OP_CHECKSIG')

  // one ratasohi
  var opRetRat = 1
  tx.addOutput(opReturnScript, opRetRat)

  var registryAmount = (new Decimal(registryAmountBLK)).times(BLK_INFO.per1)
  var payloadAmountRat = registryAmount.times(0.6).toNumber()
  var scanAmountRat = registryAmount.times(0.4).toNumber()

  tx.addOutput(payloadOutScript, payloadAmountRat)
  tx.addOutput(scanOutScript, scanAmountRat)

  var feeRat = 10000
  var totalRat = payloadAmountRat + scanAmountRat + opRetRat + feeRat

  blkqt.getUnspents(null, function (err, unspents) {
    if (err) return callback(err)

    try {
      var utxos = txUtils.selectUnspents(unspents, totalRat)
    } catch (e) {
      return callback(new Error('Not enough funds to send amount.'))
    }

    // total of utxos
    var totalUtxoRat = utxos.reduce(function (runningTotal, unspent) {
      return unspent.value + runningTotal
    }, 0)

    var changeRat = totalUtxoRat - totalRat

    if (!changeRat) {
      addInputsAndSign()
    } else {
      blkqt.getNewAddress(function (err, address) {
        if (err) return callback(err)
        tx.addOutput(txUtils.addressToOutputScript(address), changeRat)
        addInputsAndSign()
      })
    }

    function addInputsAndSign () {
      async.mapSeries(utxos, function (utxo, done) {
        tx.addInput(utxo.txId, utxo.vout)
        blkqt.getWif(utxo.address, function (err, wif) {
          if (err) return done(err)
          var key = cc.CoinKey.fromWif(wif)
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
  })
}

module.exports = {
  createRegistryTx: createRegistryTx
}
