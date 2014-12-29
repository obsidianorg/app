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

module.exports = {
  addressToOutputScript: addressToOutputScript,
  sign: sign
}