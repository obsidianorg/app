var langs = {
  'en': require('./en')
}

function getLanguageData (lang) {
  if (lang in langs) return langs[lang]
  else return langs.en
}

module.exports = {
  getLanguageData: getLanguageData,
  languages: langs
}
