import assert from 'assert'
import field from 'field'
import proxyquire from 'proxyquire'
import babel from '../../babel/resolve'

/* global describe, it */

describe('lang', function () {
  describe('+ getLanguage()', function () {
    describe('> when nothing is set', function () {
      it('should default to en', function () {
        var stubs = {}
        field.set(stubs, '@domwindow:__args__', {})
        field.set(stubs, '@domwindow:@noCallThru', true)
        babel.mapResolveKeys(stubs)

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'en')
      })
    })

    describe('> when browser language is set and not settings', function () {
      it('should return browser language', function () {
        var stubs = {}
        field.set(stubs, '@domwindow:navigator.language', 'es-MX')
        field.set(stubs, '@domwindow:__args__:CONFIG', {})
        field.set(stubs, '@domwindow:@noCallThru', true)
        babel.mapResolveKeys(stubs)

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'es')
      })
    })

    describe('> when config/settings', function () {
      it('should always use config', function () {
        var stubs = {}
        field.set(stubs, '@domwindow:navigator.language', 'es-MX')
        field.set(stubs, '@domwindow:__args__:CONFIG.settings.language', 'zh-CN')
        field.set(stubs, '@domwindow:@noCallThru', true)
        babel.mapResolveKeys(stubs)

        var lang = proxyquire('../lang', stubs)
        assert.equal(lang.getLanguage(), 'zh')
      })
    })
  })
})
