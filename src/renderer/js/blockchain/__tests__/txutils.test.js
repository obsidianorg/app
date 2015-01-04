jest.autoMockOff()

var assert = require.requireActual('assert')
var CoinKey = require.requireActual('coinkey')
var cointx = require.requireActual('cointx')
var Transaction = cointx.Transaction
var txUtils = require.requireActual('../txutils')
var fixtures = require.requireActual('./txutils.fixtures')

describe('txutils', function() {
  describe('serializeToHex()', function() {
    var txData0 = fixtures.valid[0]
    var key = CoinKey.fromWif(txData0.sender.wif)

    it('should properly serialize the first transaction', function() {
      var tx = new Transaction()
      tx.time = txData0.time

      var walletBalance = txData0.utxos.reduce(function(amount, unspent) { 
        return unspent.value + amount
      }, 0)

      txData0.utxos.forEach(function(unspent) {
        tx.addInput(unspent.txId, unspent.vout)
      })

      var recvrPubKeyHashScript = txUtils.addressToOutputScript(txData0.receiver.address)
      tx.addOutput(recvrPubKeyHashScript, txData0.amount)

      // change output
      var senderPubKeyHashScript = txUtils.addressToOutputScript(txData0.sender.address) 
      var change = walletBalance - txData0.amount - txData0.fee
      assert.equal(change, txData0.change)
      tx.addOutput(senderPubKeyHashScript, walletBalance - txData0.amount - txData0.fee)

      tx.ins.forEach(function(input, index) {
        txUtils.sign(tx, index, key)
      })

      assert.equal(txUtils.serializeToHex(tx), txData0.hex)

    })
  })
})
