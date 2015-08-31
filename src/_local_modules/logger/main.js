var ipc = require('ipc')
var logStream = require('./log-stream')

function listener () {
  ipc.on('log', function (event, item) {
    logStream.write(JSON.stringify(item) + '\n')
  })
}

function LogWriteStream () {}
LogWriteStream.prototype.write = function (rec) {
  rec.time = (new Date()).toString()
  rec.main = true
  logStream.write(JSON.stringify(rec) + '\n')
}

module.exports = {
  listener: listener,
  LogWriteStream: LogWriteStream
}
