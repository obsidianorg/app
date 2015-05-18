var coinInfo = require('coininfo')
var CoinKey = require('coinkey')

function create (coin) {
  coin = coin || 'BLK'
  var info = coinInfo(coin)

  var oldCoinKeyCreateRandom = CoinKey.createRandom
  CoinKey.createRandom = function () {
    return oldCoinKeyCreateRandom(info.versions)
  }

  var cc = {
    CoinKey: CoinKey,
    info: info
  }

  return cc
}

module.exports = {
  create: create
}
