var assert = require('assert')
var proxyquire = require('proxyquire')
var stubo = require('stubo')
// var _ = require('lodash')

/* global describe, it */

describe('keydb', function () {
  describe('+ load()', function () {
    describe('> when localStorage empty', function () {
      it('should return a new one', function () {
        var stubs = {}
        stubo(stubs, '../domwindow', 'localStorage.getItem()', null)
        stubo(stubs, '../domwindow', 'localStorage.setItem()', null)
        var keydb = proxyquire('../keydb', stubs)
        var stealth = keydb.load()
        assert.equal(stealth.version, 39)
        assert(stealth.toString().length > 0)
        assert.notEqual(stealth.toString(), 'rVwCCvsH83LavaJLxYzArexJMij8eqFJaNgzVsw7FVxPNhXQQs8RgdRWdq6X8U9DvX2EK6Z2JB7P6ZdcTgk723Ew3WHmzhYwojDayZ')
      })
    })

    describe('> when localStorage contains stealth', function () {
      it('should return it', function () {
        var sk = {
          'payloadPrivKey': 'ad7c17a0540a5867c90df9f5fb8d70e2cee37ecf17e5b6bb6c85182a5667c91e',
          'payloadPubKey': '02c90a458645cd5d0f624f6242c0aa9240afd291f31653456a015d66ad9be30cb5',
          'scanPrivKey': '0867f9ed0bb492b54bcb2eef58f17b23f2dd203b9663451ce46e06ce8e75aaae',
          'scanPubKey': '0369f6bfe5421e60730a95944263e47ce599800bf5ad5c1a657010d3a26edcf6cd',
          'version': 39
        }

        var stubs = {}
        stubo(stubs, '../domwindow', 'localStorage.getItem()', JSON.stringify(sk))
        var keydb = proxyquire('../keydb', stubs)
        var stealth = keydb.load()
        assert.equal(stealth.version, 39)
        assert.strictEqual(stealth.toString(), 'rVwCCvsH83LavaJLxYzArexJMij8eqFJaNgzVsw7FVxPNhXQQs8RgdRWdq6X8U9DvX2EK6Z2JB7P6ZdcTgk723Ew3WHmzhYwojDayZ')
      })
    })
  })
})
