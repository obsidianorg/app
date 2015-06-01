var path = require('path')
var fs = require('fs-extra')
var env = require('../env')

// only one for now
// should only be ref'd from createPdb
var PDB = {}

function createPdb (config) {
  config = config || {}
  var file = config.file || path.join(env.datadir, 'obsidian', 'pdb.db')

  var _pdb = PDB
  _pdb.file = file
  _pdb.data = null

  _pdb.init = init.bind(_pdb)
  _pdb.add = add.bind(_pdb)
  _pdb.resolve = resolve.bind(_pdb)

  return _pdb
}

function init (callback) {
  var self = this
  fs.exists(this.file, function (exists) {
    if (exists) {
      fs.readJson(self.file, function (err, data) {
        if (err) return callback(err)
        self.data = data
        callback()
      })
    } else {
      self.data = {names: {}}
      fs.outputJson(self.file, self.data, callback)
    }
  })
}

function add (name, data, callback) {
  if (this.data == null) return callback(new Error('You forgot to call init()'))
  this.data.names[name] = data
  fs.outputJson(this.file, this.data, callback)
}

function resolve (name, callback) {
  if (this.data == null) return callback(new Error('You forgot to call init()'))
  name in this.data.names ? callback(null, this.data.names[name]) : callback(null, null)
}

module.exports = {
  createPdb: createPdb
}
