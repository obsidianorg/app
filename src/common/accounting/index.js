var accounting = require('accounting')

var FORMAT = {
  symbol: 'BLK',
  format: '%v %s',
  precision: 4
}

function formatMoney (money) {
  return accounting.formatMoney(money, FORMAT)
}

module.exports = {
  FORMAT: FORMAT,
  formatMoney: formatMoney,
  fm: formatMoney
}
