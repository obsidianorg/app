var ci = require('coininfo')
var CoinKey = require('coinkey')
var blackCoinInfo = ci('BC')

function create(name) {
  var ck = CoinKey.createRandom(blackCoinInfo.versions)

  var account = {
    id: 'account:' + ck.publicAddress,
    wif: ck.privateWif,
    address: ck.publicAddress,
    name: name,
    // todo, rename to 'balance'
    amount: 0 
  }

  return account
}

module.exports = {
  create: create
}
