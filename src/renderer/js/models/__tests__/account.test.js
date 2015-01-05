jest.autoMockOff()

var assert = require.requireActual('assert')
var CoinKey = require.requireActual('coinkey')
var ci = require.requireActual('coininfo')
var accountFixtures = require.requireActual('./account.fixtures')
var blackCoinInfo = ci('BLK')

describe('create()', function() {
  var _acc1 = accountFixtures.valid[0]

  it('should create a new account', function() {
    jest.setMock('coinkey', {
      createRandom: function() {
        var privKey = new Buffer(_acc1.privateKey, 'hex')
        return new CoinKey(privKey, blackCoinInfo.versions)
      }
    })

    var Account = require('../account')
    var account = Account.create('Savings')
    
    assert.equal(account.wif, _acc1.wif)
    assert.equal(account.address, _acc1.address)
    assert.equal(account.id, 'account:' + _acc1.address)

    // todo, change to 'balance'
    assert.equal(account.amount, 0)

    // clean up
    jest.dontMock('coinkey')
  })
})
