var assert = require('assert')
var proxyquire = require('proxyquire')

/* global describe, it */

describe('lang', function () {
  describe('+ getLanguage()', function () {
    describe('> when nothing is set', function () {
      it('should default to en', function () {
        var stubs = {
          '../atom': {
            '@noCallThru': true
          },
          '../domwindow': {
            '@noCallThru': true
          }
        }

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'en')
      })
    })

    describe('> when browser language is set and not settings', function () {
      it('should return browser language', function () {
        var stubs = {
          '../atom': {
            '@noCallThru': true
          },
          '../domwindow': {
            navigator: {
              language: 'es-MX'
            },
            '@noCallThru': true
          }
        }

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'es')
      })
    })

    describe('> when config/settings', function () {
      it('should always use config', function () {
        var stubs = {
          '../atom': {
            CONFIG: {
              settings: {
                language: 'zh-CN'
              }
            },
            '@noCallThru': true
          },
          '../domwindow': {
            navigator: {
              language: 'es-MX'
            },
            '@noCallThru': true
          }
        }

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'zh')
      })
    })
  })
})
