var Stealth = require('stealth')
var window = require('../domwindow')

var STEALTH_CONSTANT = 39
var LS_KEY = 'sk'

function load () {
  var skData = window.localStorage.getItem(LS_KEY)
  if (skData == null) {
    var sk = Stealth.fromRandom({version: STEALTH_CONSTANT})
    window.localStorage.setItem(LS_KEY, sk.toJSON())
    return sk
  } else {
    return Stealth.fromJSON(skData)
  }
}

module.exports = {
  load: load
}
