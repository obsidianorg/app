import assert from 'assert'
import proxyquire from 'proxyquire'
import stubo from 'stubo'
import blockFixtures from '../../_fixtures/blocks'

/* global describe, it */

describe('block-checker', function () {
  describe('checkBlock', function () {
    describe('> when contains a valid stealth transaction', function () {
      it('should', function (done) {
        var block605977 = blockFixtures.valid[0]

        var stubs = {}
        stubo(stubs, './blkqt', 'getRawTransactionsFromBlock', function (blockHeight, callback) {
          callback(null, block605977)
        })
        stubo(stubs, './stealth-payment', 'checkTx()', {})
        stubo(stubs, './stealth-pseudonym', 'checkTx()', {pseudonym: 'obsidian-test'})
        Object.keys(stubs).forEach(key => stubs[key]['@noCallThru'] = true)

        var blockHeight = block605977.height
        var blockChecker = proxyquire('../block-checker', stubs)
        var bc = blockChecker.create()

        var _keys
        bc.on('stealth:payment:received', function (keys) {
          _keys = _keys ? assert(false, 'should only be called once') : keys
        })

        var _pseudonyms
        bc.on('stealth:pseudonym:registered', function (pseudonyms) {
          _pseudonyms = _pseudonyms ? assert(false, 'should only be called once') : pseudonyms
        })

        bc.on('block:checked', function () {
          assert(Array.isArray(_keys))
          assert(Array.isArray(_pseudonyms))

          assert.strictEqual(_keys[0].blockHeight, blockHeight)

          assert.strictEqual(_pseudonyms[0].pseudonym, 'obsidian-test')
          assert(_pseudonyms[0].txId)
          assert(_pseudonyms[0].blockHeight)
          done()
        })

        bc.checkBlock(blockHeight)
      })
    })
  })

  describe('checkBlocks()', function () {
    it('should check some blocks', function (done) {
      var blockChecker = require('../block-checker')
      var bc = blockChecker.create()

      // stub out 'checkBlock'
      var count = 0
      bc.checkBlock = function (blockHeight) {
        setImmediate(function () {
          count += 1
          bc.emit('block:checked', blockHeight)
        })
        return bc
      }

      bc.on('finish', function () {
        // check block called [0..9] (10 times)
        assert.strictEqual(count, 10)
        done()
      })

      bc.checkBlocks(0, 9)
    })
  })
})
