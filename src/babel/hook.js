require('source-map-support').install()

require('babel/register')({
  resolveModuleSource: require('./resolve').resolve,
  only: 'src/',
  extensions: ['.js'],
  sourceMap: 'inline',
  optional: [
    'es7.decorators',
    'es7.asyncFunctions',
    'es7.objectRestSpread'
  ],
  cache: false
})
