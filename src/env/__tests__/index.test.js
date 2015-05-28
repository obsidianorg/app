var assert = require('assert')
var env = require('../index')

/* global describe, it */

describe('env', function () {
  describe('+ homedir()', function () {
    it('should return proper home directory', function () {
      var path = require('path-extra')
      assert.strictEqual(env.homedir, path.homedir())
    })
  })

  describe('+ datadir()', function () {
    it('should return proper home directory', function () {
      var path = require('path-extra')
      assert.strictEqual(path.join(env.datadir, 'someapp'), path.datadir('someapp'))// , 'Did this test run under Linux? If so, path-extra.datadir() may be broken.')
    })
  })
})
