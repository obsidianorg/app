var assert = require('assert')
var _ = require('lodash')
var dumpwallet = require('../dumpwallet')
var fixtures = require('./dumpwallet.fixtures')

/* global describe, it */

describe('dumpwallet', function () {
  fixtures.valid.forEach(function (f) {
    describe('+ decode()', function () {
      it('should convert dumpwallet text format to obj', function () {
        // f.text is expressed as an array because it's easier to read
        var arr = dumpwallet.decode(f.text.join('\n'))
        assert.strictEqual(arr.length, f.array.length)
        assert(arr.length > 0)
        assert.deepEqual(arr, f.array)
      })
    })

    describe('+ encode()', function () {
      it('should covert an array of objects to dumpwallet text format', function () {
        var text = dumpwallet.encode(f.array)
        assert.strictEqual(text, f.sanitizedText.join('\n') + '\n')
      })

      describe('> when field birth is type date', function () {
        it('should still convert', function () {
          var expArr = _.cloneDeep(f.array)
          expArr.forEach(function (item) {
            item.birth = new Date(item.birth)
          })

          var text = dumpwallet.encode(expArr)
          assert.strictEqual(text, f.sanitizedText.join('\n') + '\n')
        })
      })
    })

    describe('stripCommentsAndWhitespace', function () {
      it('should strip all comments and lines with whitespace', function () {
        var sanitizedText = dumpwallet.stripCommentsAndWhitespace(f.text.join('\n'))
        assert.strictEqual(sanitizedText, f.sanitizedText.join('\n'))
      })
    })
  })
})
