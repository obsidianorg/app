var assert = require('assert')
var proxyquire = require('proxyquire')
var stubo = require('stubo')

/* global describe, it */

describe('block-manager', function () {
  describe('getLastKnownBlockCount()', function () {
    describe('> when app has ran and data in storage', function () {
      it('should return value', function (done) {
        var stubs = {}
        stubo(stubs, '../domwindow', 'localStorage.getItem', () => 653100)
        stubo(stubs, './blkqt', '@noCallThru', true)
        var blockManager = proxyquire('../block-manager', stubs)

        blockManager.getLastKnownBlockCount(function (err, n) {
          assert.ifError(err)
          assert.strictEqual(n, 653100)
          done()
        })
      })
    })

    describe('> when app has not ran and data comes from qt client', function () {
      it('should return value', function (done) {
        var stubs = {}
        // had to change output because pseudonym checkpoint
        stubo(stubs, '../domwindow', 'localStorage.getItem', (key) => key === 'hasAliasSupport')
        stubo(stubs, '../domwindow', 'localStorage.setItem', Function())
        stubo(stubs, './blkqt', 'getBlockCount', cb => { cb(null, 453100) })
        stubo(stubs, './blkqt', '@noCallThru', true)
        var blockManager = proxyquire('../block-manager', stubs)

        blockManager.getLastKnownBlockCount(function (err, n) {
          assert.ifError(err)
          assert.strictEqual(n, 453100)
          done()
        })
      })
    })
  })
})
