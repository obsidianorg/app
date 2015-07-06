var path = require('path')
var fs = require('fs-extra')
var Stealth = require('stealth')
var env = require('../env')

// only one for now
// should only be ref'd from createPdb
var PDB = {}

function createPdb (config) {
  config = config || {}
  var file = config.file || path.join(env.dataDir, 'pdb.db')

  var _pdb = PDB
  _pdb.file = file
  _pdb.data = null

  _pdb.init = init.bind(_pdb)
  _pdb.add = add.bind(_pdb)
  _pdb.matchSync = matchSync.bind(_pdb)
  _pdb.resolveSync = resolveSync.bind(_pdb)

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

function add (name, pubkeys, txId, blockHeight, callback) {
  if (this.data == null) return callback(new Error('You forgot to call init()'))

  var stealth = new Stealth(pubkeys)
  stealth.version = 39 // BlackCoin specific

  this.data.names[name] = {
    stealth: stealth.toString(),
    txId: txId,
    blockHeight: blockHeight
  }

  fs.outputJson(this.file, this.data, callback)
}

function matchSync (search) {
  if (!search) return []
  if (search.length < 2) return []
  var matchRegex = new RegExp('^' + search, 'i')
  return Object.keys(this.data.names).filter(function (name) {
    return name.match(matchRegex)
  })
}

function resolveSync (name) {
  if (this.data == null) throw new Error('You forgot to call init()')
  return name in this.data.names ? this.data.names[name] : null
}

module.exports = {
  createPdb: createPdb,
  PDB: PDB // temporary hack
}
