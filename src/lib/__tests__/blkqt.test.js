var assert = require('assert')
var proxyquire = require('proxyquire')
var _ = require('lodash')
var fixtures = require('./blkqt.fixtures')
require('terst')

/* global describe, it EQ */
/* eslint-disable no-spaced-func */

var atomStub = {
  '@noCallThru': true // for proxyquire
}

var ipcStub = {
  '@noCallThru': true
}

describe('blkqt', function () {
  describe('+ getUnspents()', function () {
    fixtures.getUnspents.valid.forEach(function (f) {
      it('should get the unspents and return the data', function (done) {
        var ipc = _.assign({
          sendIpc: function (data, callback) {
            callback(null, _.cloneDeep(f.input))
          }
        }, ipcStub)

        var stubs = {
          './ipc': ipc,
          'ipc': atomStub
        }

        var blkqt = proxyquire('../blkqt', stubs)

        // null => all addresses
        blkqt.getUnspents(null, function (err, unspents) {
          assert.ifError(err)
          assert.equal(f.input.length, unspents.length)
          for (var i = 0; i < f.input.length; ++i) {
            var inp = f.input[i]
            var utxo = unspents[i]
            var exp = f.expected[i]

            EQ(utxo.txId, inp.txid)
            EQ(utxo.txId, exp.txId)
            EQ(utxo.amountRat, exp.amountRat)
            EQ(utxo.amountRat, utxo.value)
          }

          done()
        })
      })
    })
  })
})
