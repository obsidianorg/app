var path = require('path')
require('source-map-support').install()

require('babel/register')({
  resolveModuleSource: function (src) {
    if (src.indexOf('local/') === 0) {
      // assuming __dirname => src/babel/
      var localModuleName = src.split('local/')[1]
      var localModule = path.join(__dirname, '..', '_local_modules', localModuleName)
      return localModule
    }
    return src
  },
  only: 'src/',
  extensions: ['.js'],
  sourceMap: 'inline',
  optional: ['es7.decorators', 'es7.asyncFunctions'],
  cache: false
})
