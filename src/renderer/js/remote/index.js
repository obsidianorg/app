// these are all remote atom-shell libraries
// browserify works by static analysis, but will throw an error about not
// being able to find these, hence the silly '+'
module.exports = {
  dialog: require('dia' + 'log'),
  ips: require('i' + 'pc'),
  shell: require('she' + 'll')
}