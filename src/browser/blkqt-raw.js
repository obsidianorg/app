var bitcoin = require('bitcoin')
var ipc = require('ipc')

var RPC_DATA = {
  host: 'localhost',
  port: 15715,
  // localhost only, this shouldn't matter too much
  user: 'blackcoinrpc',
  // ditto as above
  pass: 'obsidian',
  timeout: 30000
}

var _client

function connect() {
  _client = new bitcoin.Client(RPC_DATA)
  return _client
}

ipc.on('blkqt', function(event, obj) {
  var callback = function(err, res) {
    var msg = obj.msg + '-' + obj.token
    if (err) 
      event.sender.send(msg, err.message, null)
    else
      event.sender.send(msg, null, res)
  }

  obj.args.push(callback)
  _client.cmd.apply(_client, obj.args)
})

module.exports = {
  connect: connect
}
