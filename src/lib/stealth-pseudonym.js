var assert = require('assert')
var ci = require('coininfo')
var cointx = require('cointx')
var ecdsa = require('ecdsa')
var Decimal = require('decimal.js')
var Stealth = require('stealth')
var blkqt = require('../lib/blkqt')
import txUtils from '#txutils'
import { addInputsAndSign } from '#txutils/sign'
var Script = cointx.Script
var Transaction = cointx.Transaction
var BLK_INFO = ci('BLK')

var MIN_BLK = 100

function createRegistryTx (pseudonym, stealthKey, registryAmountBLK, callback) {
  assert(typeof pseudonym, 'pseudonym must be a string')
  assert(stealthKey, 'Must pass in stealthKey')
  assert(registryAmountBLK >= MIN_BLK, 'Amount must be greater than or equal to ' + MIN_BLK)

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
      addInputsAndSign(tx, utxos, blkqt.getWif, callback)
    } else {
      blkqt.getNewAddress(function (err, address) {
        if (err) return callback(err)
        tx.addOutput(txUtils.addressToOutputScript(address), changeRat)
        addInputsAndSign(tx, utxos, blkqt.getWif, callback)
      })
    }
  })
}

function createDeregistryTx (pseudonym, stealthKey, registryTxId, callback) {
  blkqt.getRawTransaction(registryTxId, function (err, txHex) {
    if (err) return callback(err)
    var keyData = checkTx(txHex)
    if (!keyData) return callback(new Error('checkTx() failed.'))

    // verify we have correct info
    var newSk = new Stealth({ ...keyData, version: 39 })
    if (stealthKey.toString() !== newSk.toString()) {
      return callback(new Error('Stealth key does not match transaction.'))
    }

    blkqt.getNewAddress(function (err, address) {
      if (err) return callback(err)

      var tx = new Transaction()
      txUtils.setCurrentTime(tx)

      var feeRat = 10000
      var sumRat = keyData.scanPubKeyData.value + keyData.payloadPubKeyData.value
      var totalRat = sumRat - feeRat

      tx.addOutput(txUtils.addressToOutputScript(address), totalRat)
      tx.addInput(registryTxId, keyData.payloadPubKeyData.vout)
      tx.addInput(registryTxId, keyData.scanPubKeyData.vout)

      sign(tx, 0, keyData.payloadPubKeyData, stealthKey.payloadPrivKey)
      sign(tx, 1, keyData.scanPubKeyData, stealthKey.scanPrivKey)

      callback(null, tx)
    })
  })

  function sign (tx, index, keyData, privKey) {
    var hash = txUtils.hashForSignature(tx, index, keyData.script, Transaction.SIGHASH_ALL)
    var signature = ecdsa.serializeSig(ecdsa.sign(new Buffer(hash), privKey))
    signature.push(Transaction.SIGHASH_ALL)
    // notice no pubkey? not necessary on pay-to-pubkey
    tx.setInputScript(index, Script.fromChunks([new Buffer(signature)]))
  }
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
    var n = tx.outs.indexOf(out)
    return {
      pubKey: out.script.chunks[0],
      value: out.value,
      vout: n,
      script: out.script
    }
  })

  if (pubKeyData.length !== 2) return null
  var pkd0 = pubKeyData[0]
  var pkd1 = pubKeyData[1]

  // verify sum is GTE than accepted value
  var sum = pkd0.value + pkd1.value
  if (new Decimal(sum).dividedBy(BLK_INFO.per1).toNumber() < MIN_BLK) return null

  var payloadPubKeyData = pkd0.value > pkd1.value ? pkd0 : pkd1
  var scanPubKeyData = pkd0.value < pkd1.value ? pkd0 : pkd1

  // no match
  return {
    pseudonym: pseudonym,
    // leaving these for compatibility for now
    payloadPubKey: payloadPubKeyData.pubKey,
    scanPubKey: scanPubKeyData.pubKey,
    // new fields
    payloadPubKeyData: payloadPubKeyData,
    scanPubKeyData: scanPubKeyData
  }
}

module.exports = {
  createRegistryTx: createRegistryTx,
  createDeregistryTx: createDeregistryTx,
  checkTx: checkTx
}
