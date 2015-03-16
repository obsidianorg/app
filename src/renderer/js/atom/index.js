// these are all atom-shell libraries
// browserify works by static analysis, but will throw an error about not
// being able to find these, hence the silly '+'
var remote = require('re' + 'mote')
module.exports = {
  app: remote.require('app'),
  dialog: remote.require('dialog'),
  fs: remote.require('fs-extra'),
  ipc: require('i' + 'pc'),
  path: remote.require('path'),
  remote: remote,
  shell: require('she' + 'll'),
  CONFIG: remote.getGlobal('CONFIG') // see browser/index.js global.CONFIG
}