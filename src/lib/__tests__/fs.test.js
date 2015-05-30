var assert = require('assert')
var fs = require('../fs')

/* global describe, it */

describe('fs', function () {
  describe('tempFile()', function () {
    it('should return a path to a temporary file', function () {
      assert.equal(typeof fs.tempFile(), 'string')

      var f1 = fs.tempFile()
      var f2 = fs.tempFile()
      assert.notEqual(f1, f2)
    })
  })
})
