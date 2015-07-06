var assign = require('object-assign')
var fs = require('fs-extra')
var ini = require('ini')

var DEFAULT_SETTINGS = {
  server: 1
}

function readSync (file) {
  var text = fs.readFileSync(file).toString('utf8')
  var data = ini.decode(text)
  assign(data, DEFAULT_SETTINGS)

  // rpc info may already be set
  data.rpcuser = data.rpcuser || 'rpcuser'
  data.rpcpassword = data.rpcpassword || 'obsidian'

  return data
}

// if defaults aren't set, this will then save them
function readSaveSync (file) {
  var data = readSync(file)
  saveSync(file, data)
  return data
}

function saveSync (file, data) {
  var text = ini.encode(data)
  fs.outputFileSync(file, text)
}

module.exports = {
  readSync: readSync,
  readSaveSync: readSaveSync,
  saveSync: saveSync
}
