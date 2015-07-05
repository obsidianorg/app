var ospath = require('ospath')

function datadir () {
  return ospath.data()
}

function homedir () {
  return ospath.home()
}

module.exports = Object.freeze({
  datadir: datadir(),
  homedir: homedir()
})
