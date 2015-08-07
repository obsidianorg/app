import assert from 'assert'
import proxyquire from 'proxyquire'
import _ from 'lodash'
import fixtures from './blkqt.fixtures'

/* global describe, it */
// trinity: mocha

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
          'ipc': ipcStub
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

            assert.strictEqual(utxo.txId, inp.txid)
            assert.strictEqual(utxo.txId, exp.txId)
            assert.strictEqual(utxo.amountRat, exp.amountRat)
            assert.strictEqual(utxo.amountRat, utxo.value)
          }

          done()
        })
      })
    })
  })
})
