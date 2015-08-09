import assert from 'assert'
import proxyquire from 'proxyquire'
import field from 'field'
import stubo from 'stubo'
import Stealth from 'stealth'
import txUtils from '../../blockchain/txutils'
import oldFixtures from './stealth-pseudonym.fixtures'

import keyFixtures from '#_fixtures/keys'
import blockFixtures from '#_fixtures/blocks'

/* global describe, it */
// trinity: mocha

// var cryptocoin = _.assign({'@noCallThru': true}, require('../../common/cryptocoin'))

describe('stealth-pseudonym', function () {
  describe('createRegistryTx', function () {
    it('should create a pseudonym registery transaction', function (done) {
      var f0 = oldFixtures.createTx.valid[0]
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
      var f0 = oldFixtures.createTx.valid[0]
      var stealthPseudonym = require('../stealth-pseudonym')
      var res = stealthPseudonym.checkTx(f0.txHex)

      assert.strictEqual(res.pseudonym, f0.pseudonym)
      assert(Buffer.isBuffer(res.scanPubKey))
      assert(Buffer.isBuffer(res.payloadPubKey))
      assert.strictEqual(res.scanPubKey.toString('hex'), f0.stealth.scanPubKey)
      assert.strictEqual(res.payloadPubKey.toString('hex'), f0.stealth.payloadPubKey)
    })
  })

  describe('createDeregistryTx()', function () {
    it('should create a pseudonym transaction to deregister the pseudonym', function (done) {
      // fixtures
      let registerBlockData = blockFixtures.valid[1]
      let deregisterBlockData = blockFixtures.valid[2]
      let ts = deregisterBlockData._meta.txTimestamp
      let recoverAddress = deregisterBlockData._meta.recoverAddress
      let registryTxId = registerBlockData._meta.tx
      let deregistryTxId = deregisterBlockData._meta.tx
      let stealthKeyData = keyFixtures.valid[0]
      let pseudonym = stealthKeyData.alias
      let sk = Stealth.fromJSON(JSON.stringify(stealthKeyData))

      let stubs = {}
      field.set(stubs, '../lib/blkqt:@noCallThru', true)
      field.set(stubs, '../lib/blkqt:getRawTransaction', (txId, callback) => {
        txId === registryTxId ? callback(null, registerBlockData.txs[txId]) : callback(new Error('TX not found'))
      })
      field.set(stubs, '../lib/blkqt:getNewAddress', (callback) => callback(null, recoverAddress))
      field.set(stubs, '../blockchain/txutils:setCurrentTime', (tx) => tx.timestamp = ts)

      const stealthPseudonym = proxyquire('../stealth-pseudonym', stubs)

      stealthPseudonym.createDeregistryTx(pseudonym, sk, registryTxId, function (err, tx) {
        assert.ifError(err)
        let hex = txUtils.serializeToHex(tx)
        assert.strictEqual(hex, deregisterBlockData.txs[deregistryTxId])
        done()
      })
    })
  })
})
