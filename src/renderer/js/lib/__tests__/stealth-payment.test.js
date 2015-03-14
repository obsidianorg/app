var assert = require('assert')
var CoinKey = require('coinkey')
var proxyquire = require('proxyquire')
var _ = require('lodash')
var terst = require('terst')
var txUtils = require('../../blockchain/txutils')
// the fixtures will almost certainly require refactoring
var fixtures = require('./stealth-payment.fixtures')

var blkqtStub = {
  '@noCallThru': true // for proxyquire
}

var cryptocoin = _.assign({'@noCallThru':true}, require('../../../../common/cryptocoin'))

describe('stealth-payment', function () {
  describe('+ prepareSend()', function () {
    it('should prepare', function(done) {
      var f1 = fixtures.prepareSend.valid[0]

      var blkqt = _.assign({
        getUnspents: function(address, callback) {
          callback(null, f1.output.utxos)
        }
      }, blkqtStub)

      var stubs = {
        '../lib/blkqt': blkqt,
        '@common/cryptocoin': cryptocoin
      }

      var stealthPayment = proxyquire('../stealth-payment', stubs)
      stealthPayment.prepareSend(f1.input, function(err, data) {
        NEQ(err)
        assert.deepEqual(data, f1.output)
        done()
      })
    })
  })

  describe('+ createTx()', function() {
    it('should create the tx', function(done) {
      var f1ps = fixtures.prepareSend.valid[0]
      var f1ctx = fixtures.createTx.valid[0]

      var blkqt = _.assign({
        getNewAddress: function(callback) {
          callback(null, f1ctx.standardOutputs[1].address)
        },
        getWif: function(address, callback) {
          callback(null, f1ctx.utxoKeys[0])
        }
      }, blkqtStub)

      var stubs = {
        '../lib/blkqt': blkqt,
        '@common/cryptocoin': _.assign(cryptocoin, {
          create: function() {
            return {
              CoinKey: {
                createRandom: function() {
                  return CoinKey.fromWif(f1ctx.nonce)
                },
                fromWif: CoinKey.fromWif
              }
            }
          }
        }),
        '../blockchain/txutils': {
          setCurrentTime: function(tx) {
            tx.timestamp = f1ctx.timestamp
          }
        }
      }

      var stealthPayment = proxyquire('../stealth-payment', stubs)
      stealthPayment.createTx(f1ps.output, function(err, tx) {
        NEQ(err)
        var hex = txUtils.serializeToHex(tx)
        EQ(f1ctx.txHex, hex)
        done()
      })
    })
  })
})

