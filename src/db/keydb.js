var CoinKey = require('coinkey')
var Stealth = require('stealth')
var window = require('../domwindow')

var STEALTH_CONSTANT = 0x27
var LS_KEY = 'sk'

function create (scan, payload) {
  return new Stealth({
    scanPrivKey: scan.privateKey,
    scanPubKey: scan.publicKey,
    payloadPrivKey: payload.privateKey,
    payloadPubKey: payload.publicKey,
    version: STEALTH_CONSTANT
  })
}

function load () {
  var skData = window.localStorage.getItem(LS_KEY)
  if (skData == null) {
    var sk = create(CoinKey.createRandom(), CoinKey.createRandom())
    window.localStorage.setItem(LS_KEY, sk.toJSON())
    return sk
  } else {
    return Stealth.fromJSON(skData)
  }
}

module.exports = {
  create: create,
  load: load
}
