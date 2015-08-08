var clone = require('clone')
var path = require('path')

function resolver () {
  var dir = this.dir
  var prefix = this.prefix

  return function resolve (src) {
    if (src.indexOf(prefix) !== 0) return src
    var localModuleName = src.split(prefix)[1]
    var localModule = path.resolve(dir, localModuleName)
    return localModule
  }
}

function mapKeys (stubbedObject) {
  stubbedObject = clone(stubbedObject)
  var resolve = this.resolve

  Object.keys(stubbedObject).forEach(function (key) {
    var val = stubbedObject[key]
    delete stubbedObject[key]
    var newKey = resolve(key)
    stubbedObject[newKey] = val
  })
  return stubbedObject
}

function create (prefix, dir) {
  var res = {
    prefix: prefix,
    dir: dir,
    mapKeys: mapKeys
  }

  res.resolve = resolver.call(res)
  return res
}

module.exports = {
  create: create
}
