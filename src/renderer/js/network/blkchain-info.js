var request = require('superagent')

var URL = 'http://blkchain.info/api/address/'

function fetchBalance(address, callback) {
  var url = URL + address
  request.get(url).end(function(res) {
    if (!res.ok) return callback(new Error('error'), res)
    if (typeof res.body.balance != 'number') return callback(new Error('balance field error'), res)
    callback(null, res.body.balance)
  })
}

module.exports = {
  fetchBalance: fetchBalance
}
