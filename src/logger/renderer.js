var ipc = require('ipc')

function LogWriteStream () {}
LogWriteStream.prototype.write = function (rec) {
  rec.time = (new Date()).toString()
  rec.main = false
  ipc.send('log', rec)
}

module.exports = {
  LogWriteStream: LogWriteStream
}
