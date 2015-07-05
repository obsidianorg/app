module.exports = function ymd (date) {
  return date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
}

module.exports.utc = function utc (date) {
  return date.getUTCFullYear() + '-' + ('0' + (1 + date.getUTCMonth())).slice(-2) + '-' + ('0' + date.getUTCDate()).slice(-2)
}