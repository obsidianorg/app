var CoinKey = require('coinkey')
var Stealth = require('stealth')
var json = require('./json')

var STEALTH_CONSTANT = 0x27
var LS_KEY = 'sk'

function create(scan, payload) {
  return new Stealth({
    scanPrivKey: scan.privateKey,
    scanPubKey: scan.publicKey,
    payloadPrivKey: payload.privateKey,
    payloadPubKey: payload.publicKey,
    version: STEALTH_CONSTANT
  })
}

function load() {
  var skData = window.localStorage.getItem(LS_KEY)
  if (skData == null) {
    var sk = create(CoinKey.createRandom(), CoinKey.createRandom())
    var data = {
      scanPrivKey: sk.scanPrivKey,
      scanPubKey: sk.scanPubKey,
      payloadPrivKey: sk.payloadPrivKey,
      payloadPubKey: sk.payloadPubKey,
      version: STEALTH_CONSTANT
    }

    window.localStorage.setItem(LS_KEY, JSON.stringify(data))
    return sk
  } else {
    return new Stealth(JSON.parse(skData, json.revivers.buffer))
  }
}

module.exports = {
  create: create,
  load: load
}
