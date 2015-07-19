var clone = require('clone')
var path = require('path')

function resolve (src) {
  if (src.indexOf('@') === 0) {
    // assuming __dirname => src/babel/
    var localModuleName = src.split('@')[1]
    var localModule = path.join(__dirname, '..', '_local_modules', localModuleName)
    return localModule
  }
  return src
}

// used in resolving correct module locations for unit tests / stubs
function mapKeys (obj) {
  obj = clone(obj)
  Object.keys(obj).forEach(function (key) {
    var val = obj[key]
    delete obj[key]
    var newKey = resolve(key)
    obj[newKey] = val
  })
  return obj
}

module.exports = {
  resolve: resolve,
  mapKeys: mapKeys
}
