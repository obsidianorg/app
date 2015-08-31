var isRenderer = require('is-electron-renderer')
var bunyan = require('./bunyan')

var logger
var LogWriteStream

if (isRenderer) {
  LogWriteStream = require('./renderer').LogWriteStream
  logger = bunyan.createLogger(new LogWriteStream())
} else {
  LogWriteStream = require('./main').LogWriteStream
  logger = bunyan.createLogger(new LogWriteStream())
}

module.exports = logger
