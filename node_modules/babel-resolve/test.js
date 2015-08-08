var test = require('tape')
var babelResolver = require('./')

test('create() should create a resolver', function (t) {
  var resolver = babelResolver.create('local/', '/tmp/src')
  t.equal(resolver.prefix, 'local/', 'prefix should be set')
  t.equal(resolver.dir, '/tmp/src', 'dir should be set')
  t.end()
})

test('resolve() should return proper module location', function (t) {
  var resolver = babelResolver.create('local/', '/tmp/src')
  var modLoc = resolver.resolve('local/my-module')
  t.equal(modLoc, '/tmp/src/my-module', 'should resolve to proper location')
  t.end()
})

test('mapKeys() should map keys to proper module locations', function (t) {
  var resolver = babelResolver.create('local/', '/tmp/src')
  var stubs = {
    'local/somemod1': 'blah',
    'local/somemod2': 'blah2'
  }
  var stubs2 = resolver.mapKeys(stubs)
  t.deepEqual(stubs2, {
    '/tmp/src/somemod1': 'blah',
    '/tmp/src/somemod2': 'blah2'
  }, 'map keys should set result')

  t.deepEqual(stubs, {
    'local/somemod1': 'blah',
    'local/somemod2': 'blah2'
  }, 'verify that mapKeys does not mutate input')
  t.end()
})
