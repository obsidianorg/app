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

var cc = require('../common/cryptocoin').create()

var MIN_BLK = 100

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

function checkTx (hex) {
  var tx = txUtils.parseFromHex(hex)

  // must have a minimum of three outputs
  if (tx.outs.length < 3) return null

  // can be optimized a bit, but the string constant makes it obvious
  var opReturnOut = tx.outs.filter(function (out) {
    return (out.script.toASM().indexOf('OP_RETURN') === 0)
  })

  if (opReturnOut.length === 0) {
    return null
  }

  // only ever 1
  opReturnOut = opReturnOut[0]
  var opReturnData = opReturnOut.script.chunks[1]
  var opReturnDataString = opReturnData.toString('utf8')

  if (opReturnDataString.indexOf('_OPRG:') !== 0) {
    return null
  }

  var pseudonym = opReturnDataString.slice('_OPRG:'.length)

  var pubKeyData = tx.outs.filter(function (out) {
    return (
      out.script &&
      Array.isArray(out.script.chunks) &&
      out.script.chunks.length === 2 &&
      Buffer.isBuffer(out.script.chunks[0]) &&
      out.script.chunks[0].length === 33
    )
  }).map(function (out) {
    return {
      pubKey: out.script.chunks[0],
      value: out.value
    }
  })

  if (pubKeyData.length !== 2) return null
  var pkd0 = pubKeyData[0], pkd1 = pubKeyData[1]

  // verify sum is GTE than accepted value
  var sum = pkd0.value + pkd1.value
  if (new Decimal(sum).dividedBy(BLK_INFO.per1).toNumber() < MIN_BLK) return null

  var payloadPubKey = pkd0.value > pkd1.value ? pkd0.pubKey : pkd1.pubKey
  var scanPubKey = pkd0.value < pkd1.value ? pkd0.pubKey : pkd1.pubKey

  // no match
  return {
    pseudonym: pseudonym,
    payloadPubKey: payloadPubKey,
    scanPubKey: scanPubKey
  }
}

module.exports = {
  createRegistryTx: createRegistryTx,
  checkTx: checkTx
}

