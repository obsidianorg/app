var window = require('../domwindow')

function getLanguage () {
  var CONFIG = window.__args__.CONFIG
  var browserLang = (window && window.navigator && window.navigator.language) || 'en-US'
  var settingsLang = (CONFIG && CONFIG.settings && CONFIG.settings.language)
  return settingsLang ? settingsLang.slice(0, 2) : browserLang.slice(0, 2)
}

module.exports = {
  getLanguage: getLanguage
}
