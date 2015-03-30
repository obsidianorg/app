var assert = require('assert')

/* global describe, it */

describe('lang', function () {
  describe('+ getLanguageData()', function () {
    describe('> when language supported', function () {
      it('should return lang data', function () {
        var lang = require('../')
        var language = 'en'
        var enData = lang.languages[language]
        assert(enData)
        var langData = lang.getLanguageData(language)
        assert.deepEqual(enData, langData)
      })
    })

    describe('> when language not supported', function () {
      it('should return english', function () {
        var lang = require('../')
        var language = 'xx'

        var xxData = lang.languages[language]
        var enData = lang.languages['en']

        assert.equal(typeof xxData, 'undefined')
        assert(enData)

        var langData = lang.getLanguageData(language)
        assert.deepEqual(enData, langData)
      })
    })
  })
})
