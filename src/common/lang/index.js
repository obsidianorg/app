var langs = {
  'en': require('./en')
}

function getLanguageData (lang) {
  if (lang in langs) return langs[lang]
  else return langs.en
}

function getContext (fileName) {
  var file = path.basename(fileName).split('.')[0]
  return this[file]
}

Object.keys(langs).forEach(function (key) {
  var ld = langs[key]
  ld.getContext = getContext.bind(ld)
})

module.exports = {
  getLanguageData: getLanguageData,
  languages: langs
}
