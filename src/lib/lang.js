var atom = require('../atom')
var window = require('../domwindow')

function getLanguage () {
  var browserLang = (window && window.navigator && window.navigator.language) || 'en-US'
  var settingsLang = (atom && atom.CONFIG && atom.CONFIG.settings && atom.CONFIG.settings.language)
  return settingsLang ? settingsLang.slice(0, 2) : browserLang.slice(0, 2)
}

module.exports = {
  getLanguage: getLanguage
}
