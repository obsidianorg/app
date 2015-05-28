var path = require('path')

// would use require('app'), but that only works in the main process
// some code borrowed from https://github.com/jprichardson/node-path-extra

function datadir () {
  var data = {
    darwin: path.join(homedir(), 'Library', 'Application Support'),
    lin: process.env['$XDG_CONFIG_HOME'] || path.join(homedir(), '.config'),
    win: process.env.APPDATA
  }

  return data[Object.keys(data).filter(function (os) {
    return process.platform.match(os)
  })[0]]
}

function homedir () {
  var data = {
    darwin: process.env.HOME,
    lin: process.env.HOME,
    win: process.env.USERPROFILE
  }

  return data[Object.keys(data).filter(function (os) {
    return process.platform.match(os)
  })[0]]
}

module.exports = Object.freeze({
  datadir: datadir(),
  homedir: homedir()
})
