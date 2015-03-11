// these are all atom-shell libraries
// browserify works by static analysis, but will throw an error about not
// being able to find these, hence the silly '+'
var remote = require('re' + 'mote')
module.exports = {
  dialog: remote.require('dialog'),
  ipc: require('i' + 'pc'),
  remote: remote,
  shell: require('she' + 'll')
}