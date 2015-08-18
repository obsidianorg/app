import assert from 'assert'
import proxyquire from 'proxyquire'
import field from 'field'
var babel = require('../../babel/resolve')

/* global describe, it */
// trinity: mocha

describe('block-manager', function () {
  describe('getLastKnownBlockCount()', function () {
    describe('> when app has ran and data in storage', function () {
      it('should return value', function (done) {
        var stubs = {}
        field.set(stubs, '#domwindow:localStorage.getItem', () => 653100)
        field.set(stubs, '#domwindow:@noCallThru', true)
        field.set(stubs, './blkqt:@noCallThru', true)
        stubs = babel.mapKeys(stubs)
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
        field.set(stubs, '#domwindow:localStorage.getItem', (key) => key === 'hasAliasSupport')
        field.set(stubs, '#domwindow:localStorage.setItem', function () {})
        field.set(stubs, '#domwindow:@noCallThru', true)
        field.set(stubs, './blkqt:getBlockCount', cb => { cb(null, 453100) })
        field.set(stubs, './blkqt:@noCallThru', true)
        stubs = babel.mapKeys(stubs)
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
