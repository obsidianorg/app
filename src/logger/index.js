var isRenderer = require('is-electron-renderer')
var bunyan = require('./bunyan')

var logger
if (isRenderer) {
  var LogWriteStream = require('./renderer').LogWriteStream
  logger = bunyan.createLogger(new LogWriteStream())
} else {
  var LogWriteStream = require('./main').LogWriteStream
  logger = bunyan.createLogger(new LogWriteStream())
}

module.exports = logger
