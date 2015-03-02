var bitcoin = require('bitcoin')

function connect(rpcConfig, callback) {
  var client = new bitcoin.Client(rpcConfig)

  // test connection
  client.cmd('getinfo', function() {}, function(err) {
    if (err && err.code !== -1) return callback(err)
    callback(null, client)
  })
}

module.exports = {
  connect: connect
}