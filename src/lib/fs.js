var path = require('path')
var os = require('os')
var fs = require('fs-extra')

function tempFile () {
  var file = Date.now().toString(16) + '' + parseInt(Math.random().toString().slice(2), 10).toString(16)
  return path.join(os.tmpdir(), file)
}

fs.tempFile = fs.tempFile || tempFile

module.exports = fs
