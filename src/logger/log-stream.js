var cfs = require('cfs')
var fs = require('fs-extra')
var ospath = require('ospath')
var path = require('path')
var ymd = require('ymd')

var logDir = path.join(ospath.data(), 'obsidian', 'logs')
fs.ensureDirSync(logDir)

function pathFn () {
  var dateFile = path.join(logDir, ymd(new Date()) + '.txt')
  return dateFile
}

var logWriter = cfs.createWriteStream(pathFn, { flags: 'a' })
module.exports = logWriter
