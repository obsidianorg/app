var assert = require('assert')
var cs = require('coinstring')
var blackCoinInfo = require('coininfo')('BLK')
var bufferutils = require('./cointx/bufferutils')
var crypto = require('./cointx/crypto')
var ecdsa = require('ecdsa')
var scripts = require('cointx').scripts
var Script = require('cointx').Script
var Transaction = require('cointx').Transaction

function addressToOutputScript (address) {
  var pubKeyHash = cs.decode(address, blackCoinInfo.versions.public)
  return scripts.pubKeyHashOutput(new Buffer(pubKeyHash, 'hex'))
}

function clone (tx) {
  var newTx = new Transaction()
  newTx.version = tx.version
  newTx.timestamp = tx.timestamp
  newTx.locktime = tx.locktime

  newTx.ins = tx.ins.map(function (txin) {
    return {
      hash: txin.hash,
      index: txin.index,
      script: txin.script,
      sequence: txin.sequence
    }
  })

  newTx.outs = tx.outs.map(function (txout) {
    return {
      script: txout.script,
      value: txout.value
    }
  })

  return newTx
}

function hashForSignature (tx, inIndex, prevOutScript, hashType) {
  assert.equal(typeof inIndex, 'number')
  assert.equal(typeof hashType, 'number')
  assert(prevOutScript.constructor.name === 'Script')

  assert(inIndex >= 0, 'Invalid vin index')
  assert(inIndex < tx.ins.length, 'Invalid vin index')

  var txTmp = clone(tx)
  var OP_CODESEPARATOR = 171
  var hashScript = prevOutScript.without(OP_CODESEPARATOR)

  // Blank out other inputs' signatures
  txTmp.ins.forEach(function (txin) {
    txin.script = Script.EMPTY
  })
  txTmp.ins[inIndex].script = hashScript

  var hashTypeModifier = hashType & 0x1f
  if (hashTypeModifier === Transaction.SIGHASH_NONE) {
    assert(false, 'SIGHASH_NONE not yet supported')
  } else if (hashTypeModifier === Transaction.SIGHASH_SINGLE) {
    assert(false, 'SIGHASH_SINGLE not yet supported')
  }

  if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
    assert(false, 'SIGHASH_ANYONECANPAY not yet supported')
  }

  var hashTypeBuffer = new Buffer(4)
  hashTypeBuffer.writeInt32LE(hashType, 0)

  // todo, implement a new TX class or serializeToBuffer
  var txTmpBuffer = new Buffer(serializeToHex(txTmp), 'hex')
  var buffer = Buffer.concat([txTmpBuffer, hashTypeBuffer])
  return crypto.hash256(buffer)
}

function sign (tx, index, keyPair) {
  var prevOutScript = scripts.pubKeyHashOutput(keyPair.publicHash)
  var hash = hashForSignature(tx, index, prevOutScript, Transaction.SIGHASH_ALL)
  var signature = ecdsa.serializeSig(ecdsa.sign(new Buffer(hash), keyPair.privateKey))
  signature.push(Transaction.SIGHASH_ALL)
  tx.setInputScript(index, Script.fromChunks([new Buffer(signature), keyPair.publicKey]))
}

function parseFromHex (hex) {
  var buffer = new Buffer(hex, 'hex')

  var offset = 0
  function readSlice (n) {
    offset += n
    return buffer.slice(offset - n, offset)
  }
  function readUInt32 () {
    var i = buffer.readUInt32LE(offset)
    offset += 4
    return i
  }
  function readUInt64 () {
    var i = bufferutils.readUInt64LE(buffer, offset)
    offset += 8
    return i
  }
  function readVarInt () {
    var vi = bufferutils.readVarInt(buffer, offset)
    offset += vi.size
    return vi.number
  }

  var tx = new Transaction()
  tx.version = readUInt32()
  tx.timestamp = readUInt32()

  var vinLen = readVarInt()
  for (var i = 0; i < vinLen; ++i) {
    var hash = readSlice(32)
    var vout = readUInt32()
    var scriptLen = readVarInt()
    var script = readSlice(scriptLen)
    var sequence = readUInt32()

    tx.ins.push({
      hash: hash,
      index: vout,
      script: Script.fromBuffer(script),
      sequence: sequence
    })
  }

  var voutLen = readVarInt()
  for (i = 0; i < voutLen; ++i) {
    var value = readUInt64()
    scriptLen = readVarInt()
    script = readSlice(scriptLen)

    tx.outs.push({
      value: value,
      script: Script.fromBuffer(script)
    })
  }

  tx.locktime = readUInt32()
  assert.equal(offset, buffer.length, 'Transaction has unexpected data')

  return tx
}

function serializeToHex (tx) {
  var txInSize = tx.ins.reduce(function (a, x) {
    return a + (40 + bufferutils.varIntSize(x.script.buffer.length) + x.script.buffer.length)
  }, 0)

  var txOutSize = tx.outs.reduce(function (a, x) {
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
  function writeSlice (slice) {
    slice.copy(buffer, offset)
    offset += slice.length
  }
  function writeUInt32 (i) {
    buffer.writeUInt32LE(i, offset)
    offset += 4
  }
  function writeUInt64 (i) {
    bufferutils.writeUInt64LE(buffer, i, offset)
    offset += 8
  }
  function writeVarInt (i) {
    var n = bufferutils.writeVarInt(buffer, i, offset)
    offset += n
  }

  writeUInt32(tx.version)
  writeUInt32(tx.timestamp)
  writeVarInt(tx.ins.length)

  tx.ins.forEach(function (txin) {
    writeSlice(txin.hash)
    writeUInt32(txin.index)
    writeVarInt(txin.script.buffer.length)
    writeSlice(txin.script.buffer)
    writeUInt32(txin.sequence)
  })

  writeVarInt(tx.outs.length)
  tx.outs.forEach(function (txout) {
    writeUInt64(txout.value)
    writeVarInt(txout.script.buffer.length)
    writeSlice(txout.script.buffer)
  })

  writeUInt32(tx.locktime)

  return buffer.toString('hex')
}

function selectUnspents (unspents, needed) {
  var sorted = [].concat(unspents).sort(function (o1, o2) {
    return o2.value - o1.value
  })

  var have = 0
  var results = []

  while (have < needed) {
    var unspent = sorted.shift()
    if (!unspent) {
      throw new Error('NSF') // not enough
    }

    results.push(unspent)
    have += unspent.value
  }

  return results
}

function setCurrentTime (tx) {
  tx.timestamp = Math.floor(Date.now() / 1000)
}

module.exports = {
  addressToOutputScript: addressToOutputScript,
  clone: clone,
  hashForSignature: hashForSignature,
  parseFromHex: parseFromHex,
  selectUnspents: selectUnspents,
  sign: sign,
  serializeToHex: serializeToHex,
  setCurrentTime: setCurrentTime
}
