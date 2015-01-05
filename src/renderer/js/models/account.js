var ci = require('coininfo')
var CoinKey = require('coinkey')
var blackCoinInfo = ci('BLK')

function createFromCoinKey(name, ck) {
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

function create(name) {
  return createFromCoinKey(name, CoinKey.createRandom(blackCoinInfo.versions))
}

function createFromWif(name, wif) {
  return createFromCoinKey(name, CoinKey.fromWif(wif))
}

module.exports = {
  create: create,
  createFromWif: createFromWif
}
