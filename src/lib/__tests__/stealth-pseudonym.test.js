var assert = require('assert')
var proxyquire = require('proxyquire')
var _ = require('lodash')
var Stealth = require('stealth')
var txUtils = require('../../blockchain/txutils')
var fixtures = require('./stealth-pseudonym.fixtures')

/* global describe, it */

var blkqtStub = {
  '@noCallThru': true // for proxyquire
}
var cryptocoin = _.assign({'@noCallThru': true}, require('../../common/cryptocoin'))

describe('stealth-pseudonym', function () {
  describe('createRegistryTx', function () {
    it('should create a pseudonym registery transaction', function (done) {
      var f1 = fixtures.createTx.valid[0]
      var blkqt = _.assign({
        getUnspents: function (address, callback) {
          callback(null, f1.utxos)
        },
        getNewAddress: function (callback) {
          callback(null, f1.standardOutputs[0].address)
        },
        getWif: function (address, callback) {
          callback(null, f1.utxoKeys[0])
        }
      }, blkqtStub)

      var stubs = {
        '../lib/blkqt': blkqt,
        '../common/cryptocoin': cryptocoin,
        '../blockchain/txutils': {
          setCurrentTime: function (tx) {
            tx.timestamp = f1.timestamp
          }
        }
      }

      var stealthPseudonym = proxyquire('../stealth-pseudonym', stubs)
      var stealthKey = Stealth.fromJSON(JSON.stringify(f1.stealth))
      stealthPseudonym.createRegistryTx(f1.pseudonym, stealthKey, function (err, tx) {
        assert.ifError(err)
        var hex = txUtils.serializeToHex(tx)
        assert.strictEqual(f1.txHex, hex)
        done()
      })
    })
  })
})
