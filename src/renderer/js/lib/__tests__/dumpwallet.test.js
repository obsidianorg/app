var assert = require('assert')
var CoinKey = require('coinkey')
var terst = require('terst')
var dumpwallet = require('../dumpwallet')
var fixtures = require('./dumpwallet.fixtures')

describe('dumpwallet', function() {
  fixtures.valid.forEach(function(f) {
    describe('+decode()', function() {
      it('should convert dumpwallet text format to obj', function() {
        // f.text is expressed as an array because it's easier to read
        var arr = dumpwallet.decode(f.text.join('\n'))
        EQ(arr.length, f.array.length)
        T(arr.length > 0)
        assert.deepEqual(arr, f.array)
      })
    })

    describe('stripCommentsAndWhitespace', function() {
      it('should strip all comments and lines with whitespace', function() {
        var sanitizedText = dumpwallet.stripCommentsAndWhitespace(f.text.join('\n'))
        EQ(sanitizedText, f.sanitizedText.join('\n'))
      })
    })
  })
})