var ospath = require('ospath')
var path = require('path')

if (!process.NODE_ENV) process.NODE_ENV = 'prod'

function dataDir () {
  return path.join(ospath.data(), 'obsidian')
}

function logDir () {
  return path.join(dataDir(), 'logs')
}

function obsidianConfFile () {
  return path.join(dataDir(), 'obsidian.conf.json')
}

function keyFile () {
  return path.join(dataDir(), 'keys.db')
}

function qtConfFile () {
  switch (process.platform) {
    case 'win32':
    case 'darwin':
      return path.join(ospath.data(), 'BlackCoin', 'blackcoin.conf')
    case 'linux':
      return path.join(ospath.home(), '.blackcoin', 'blackcoin.conf')
  }
}

function qtBinFile () {
  switch (process.platform) {
    case 'win32':
      return 'C:\\Program Files\\Bitcoin\\blackcoin-qt.exe'
    case 'darwin':
      return '/Applications/BlackCoin-Qt.app/Contents/MacOS/BlackCoin-Qt'
    case 'linux':
      return '/usr/local/bin/blackcoin-qt'
  }
}

module.exports = Object.freeze({
  dataDir: dataDir(),
  logDir: logDir(),
  keyFile: keyFile(),
  qtBinFile: qtBinFile(),
  qtConfFile: qtConfFile(),
  obsidianConfFile: obsidianConfFile(),
  mode: process.NODE_ENV
})
