var babelResolve = require('babel-resolve')
var resolver = babelResolve.create('#', './src/_local_modules')

module.exports = resolver
