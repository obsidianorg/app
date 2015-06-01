var assert = require('assert')
var proxyquire = require('proxyquire')
var stubo = require('stubo')
var Stealth = require('stealth')
var txUtils = require('../../blockchain/txutils')
var fixtures = require('./stealth-pseudonym.fixtures')

/* global describe, it */

// var cryptocoin = _.assign({'@noCallThru': true}, require('../../common/cryptocoin'))

describe('stealth-pseudonym', function () {
  describe('createRegistryTx', function () {
    it('should create a pseudonym registery transaction', function (done) {
      var f0 = fixtures.createTx.valid[0]
      var stubs = {'../lib/blkqt': {'@noCallThru': true}}
      stubo(stubs, '../lib/blkqt', 'getUnspents', (address, callback) => callback(null, f0.utxos))
      stubo(stubs, '../lib/blkqt', 'getNewAddress', (callback) => callback(null, f0.standardOutputs[0].address))
      stubo(stubs, '../lib/blkqt', 'getWif', (address, callback) => callback(null, f0.utxoKeys[0]))
      stubo(stubs, '../blockchain/txutils', 'setCurrentTime', (tx) => tx.timestamp = f0.timestamp)

      var stealthPseudonym = proxyquire('../stealth-pseudonym', stubs)
      var stealthKey = Stealth.fromJSON(JSON.stringify(f0.stealth))
      stealthPseudonym.createRegistryTx(f0.pseudonym, stealthKey, 300, function (err, tx) {
        assert.ifError(err)
        var hex = txUtils.serializeToHex(tx)
        assert.strictEqual(f0.txHex, hex)
        done()
      })
    })
  })

  describe('checkTx', function () {
    it('should return the pub keys and pseudonym of a valid tx', function () {
      var f0 = fixtures.createTx.valid[0]
      var stealthPseudonym = require('../stealth-pseudonym')
      var res = stealthPseudonym.checkTx(f0.txHex)

      assert.strictEqual(res.pseudonym, f0.pseudonym)
      assert(Buffer.isBuffer(res.scanPubKey))
      assert(Buffer.isBuffer(res.payloadPubKey))
      assert.strictEqual(res.scanPubKey.toString('hex'), f0.stealth.scanPubKey)
      assert.strictEqual(res.payloadPubKey.toString('hex'), f0.stealth.payloadPubKey)
    })
  })
})
