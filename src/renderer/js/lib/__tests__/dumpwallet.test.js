var assert = require('assert')
var CoinKey = require('coinkey')
var terst = require('terst')
var dumpwallet = require('../dumpwallet')
var fixtures = require('./dumpwallet.fixtures')

// probably could have done JSON reviver here
fixtures.valid.forEach(function(f) {
  f.object.forEach(function(item) {
    item.birth = new Date(item.birth)
  })
})

describe('dumpwallet', function() {
  fixtures.valid.forEach(function(f) {
    describe('stripCommentsAndWhitespace', function() {
      it('should strip all comments and lines with whitespace', function() {
        var sanitizedText = dumpwallet.stripCommentsAndWhitespace(f.text.join('\n'))
        EQ(sanitizedText, f.sanitizedText.join('\n'))
      })
    })
  })
})