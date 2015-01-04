var cs = require('coinstring')
var blackCoinInfo = require('coininfo')('BC')
var ecdsa = require('ecdsa')
var scripts = require('cointx').scripts
var Script = require('cointx').Script
var Transaction = require('cointx').Transaction

function addressToOutputScript(address) {
  var pubKeyHash = cs.decode(address, blackCoinInfo.versions.public)
  return scripts.pubKeyHashOutput(new Buffer(pubKeyHash, 'hex'))
}

function sign(tx, index, keyPair) {
  var prevOutScript = scripts.pubKeyHashOutput(keyPair.publicHash)
  var hash = tx.hashForSignature(index, prevOutScript, Transaction.SIGHASH_ALL)
  var signature = ecdsa.serializeSig(ecdsa.sign(new Buffer(hash), keyPair.privateKey))
  signature.push(Transaction.SIGHASH_ALL)
  tx.setInputScript(index, Script.fromChunks([new Buffer(signature), keyPair.publicKey]))
}

function serializeToHex(tx) {
  var txInSize = tx.ins.reduce(function(a, x) {
    return a + (40 + bufferutils.varIntSize(x.script.buffer.length) + x.script.buffer.length)
  }, 0)

  var txOutSize = tx.outs.reduce(function(a, x) {
    return a + (8 + bufferutils.varIntSize(x.script.buffer.length) + x.script.buffer.length)
  }, 0)

  var buffer = new Buffer(
    12 +
    bufferutils.varIntSize(tx.ins.length) +
    bufferutils.varIntSize(tx.outs.length) +
    txInSize +
    txOutSize
  )

  var offset = 0
  function writeSlice(slice) {
    slice.copy(buffer, offset)
    offset += slice.length
  }
  function writeUInt32(i) {
    buffer.writeUInt32LE(i, offset)
    offset += 4
  }
  function writeUInt64(i) {
    bufferutils.writeUInt64LE(buffer, i, offset)
    offset += 8
  }
  function writeVarInt(i) {
    var n = bufferutils.writeVarInt(buffer, i, offset)
    offset += n
  }

  writeUInt32(tx.version)
  writeUInt32(tx.time)
  writeVarInt(tx.ins.length)

  tx.ins.forEach(function(txin) {
    writeSlice(txin.hash)
    writeUInt32(txin.index)
    writeVarInt(txin.script.buffer.length)
    writeSlice(txin.script.buffer)
    writeUInt32(txin.sequence)
  })

  writeVarInt(tx.outs.length)
  tx.outs.forEach(function(txout) {
    writeUInt64(txout.value)
    writeVarInt(txout.script.buffer.length)
    writeSlice(txout.script.buffer)
  })

  writeUInt32(tx.locktime)

  return buffer.toString('hex')
}

module.exports = {
  addressToOutputScript: addressToOutputScript,
  sign: sign,
  serializeToHex: serializeToHex
}
