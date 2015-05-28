var async = require('async')
var CoinKey = require('coinkey')
var ci = require('coininfo')
var cointx = require('cointx')
var Decimal = require('decimal.js')
var Stealth = require('stealth')
var LocalStealth = require('../db/keydb')
var blkqt = require('../lib/blkqt')
var txUtils = require('../blockchain/txutils')
var Script = cointx.Script
var Transaction = cointx.Transaction
var BLK_INFO = ci('BLK')

var cc = require('../common/cryptocoin').create()

var BLK_MUL = 1e8

function prepareSend (data, callback) {
  if (!data.receiver) return callback(new Error('Must specify a receiver.'))
  if (isNaN(parseFloat(data.amount))) return callback(new Error('Must specify a number amount.'))

  // can't send a partial ratoshi
  var sendRat = Math.floor((new Decimal(data.amount)).times(BLK_MUL).toNumber())
  var feeRat = 10000
  var opretRat = 1
  var totalRat = sendRat + feeRat + opretRat

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

    var ret = {
      amounts: {
        changeRat: changeRat,
        change: (new Decimal(changeRat)).div(BLK_MUL).toNumber(),
        feeRat: feeRat,
        fee: (new Decimal(feeRat)).div(BLK_MUL).toNumber(),
        sendRat: sendRat,
        send: (new Decimal(sendRat)).div(BLK_MUL).toNumber(),
        totalUtxoRat: totalUtxoRat,
        totalUtxo: (new Decimal(totalUtxoRat)).div(BLK_MUL).toNumber(),
        totalRat: totalRat,
        total: (new Decimal(totalRat)).div(BLK_MUL).toNumber(),
        opretRat: opretRat,
        opret: (new Decimal(opretRat)).div(BLK_MUL).toNumber()
      },
      receiver: data.receiver,
      utxos: utxos
    }

    return callback(null, ret)
  })
}

function createTx (data, callback) {
  if (!data.receiver) return callback(new Error('Missing receiver.'))
  if (typeof data.amounts.changeRat !== 'number') return callback(new Error('Missing change amount.'))
  if (typeof data.amounts.sendRat !== 'number') return callback(new Error('Missing send amount.'))
  if (typeof data.amounts.opretRat !== 'number') return callback(new Error('Missing OP_RETURN amount.'))
  if (!Array.isArray(data.utxos)) return callback(new Error('Missing utxos.'))

  var tx = new Transaction()
  txUtils.setCurrentTime(tx)

  var nonce = cc.CoinKey.createRandom()
  var opReturn = Script.fromASM('OP_RETURN ' + nonce.publicKey.toString('hex'))

  var stealth = Stealth.fromString(data.receiver)
  var a = stealth.genPaymentAddress(nonce.privateKey, BLK_INFO.versions.public)

  tx.addOutput(txUtils.addressToOutputScript(a), data.amounts.sendRat)

  if (!data.amounts.changeRat) {
    addInputsAndSign()
  } else {
    blkqt.getNewAddress(function (err, address) {
      if (err) return callback(err)
      tx.addOutput(txUtils.addressToOutputScript(address), data.amounts.changeRat)
      addInputsAndSign()
    })
  }

  function addInputsAndSign () {
    // make OP_RETURN first
    tx.addOutput(opReturn, data.amounts.opretRat)

    async.mapSeries(data.utxos, function (utxo, done) {
      tx.addInput(utxo.txId, utxo.vout)
      blkqt.getWif(utxo.address, function (err, wif) {
        if (err) return done(err)
        var key = cc.CoinKey.fromWif(wif)
        done(null, key)
      })
    }, signInputs)

    function signInputs (err, keys) {
      if (err) return callback(err)
      for (var i = 0; i < data.utxos.length; ++i) {
        var key = keys[i]
        txUtils.sign(tx, i, key)
      }

      // all done
      callback(null, tx)
    }
  }
}

function checkTx (hex) {
  var tx = txUtils.parseFromHex(hex)

  // can be optimized a bit, but the string constant makes it obvious
  var opReturnOut = tx.outs.filter(function (out) {
    return (out.script.toASM().indexOf('OP_RETURN') === 0)
  })

  if (opReturnOut.length === 0) {
    return null
  }

  // only ever 1
  opReturnOut = opReturnOut[0]

  var opReturnPubkey = opReturnOut.script.chunks[1]
  var stealth = LocalStealth.load()

  var pubKeyHashs = tx.outs.filter(function (out) {
    return (
      out.script &&
      Array.isArray(out.script.chunks) &&
      out.script.chunks.length === 5 &&
      Buffer.isBuffer(out.script.chunks[2]) &&
      out.script.chunks[2].length === 20
    )
  }).map(function (out) {
    return out.script.chunks[2]
  })

  for (var i = 0; i < pubKeyHashs.length; ++i) {
    var pubKeyHash = pubKeyHashs[i]
    var keyPair = stealth.checkPaymentPubKeyHash(opReturnPubkey, pubKeyHash)
    if (keyPair) {
      return new CoinKey(keyPair.privKey, BLK_INFO.versions)
    }
  }

  // no match
  return null
}

function checkBlock (blockHeight, callback) {
  blkqt.getRawTransactionsFromBlock(blockHeight, function (err, blockData) {
    if (err) return callback(err)
    var keys = []
    blockData.txs.forEach(function (rawTx) {
      var key = checkTx(rawTx)
      if (key) keys.push({keyPair: key, timestamp: blockData.timestamp, blockHeight: blockData.blockHeight})
    })

    callback(null, keys)
  })
}

module.exports = {
  checkBlock: checkBlock,
  checkTx: checkTx,
  createTx: createTx,
  prepareSend: prepareSend
}
