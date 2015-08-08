require('babel/register')({
  resolveModuleSource: require('./resolve').resolve,
  only: 'src/',
  extensions: ['.js'],
  optional: [
    'es7.decorators',
    'es7.asyncFunctions',
    'es7.objectRestSpread'
  ],
  cache: false
})
