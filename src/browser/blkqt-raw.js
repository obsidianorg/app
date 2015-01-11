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
}

ipc.on('blkqt', function(event) {
  var args = [].slice.call(arguments, 1)

  var callback = function(err, res) {
    if (err) 
      event.sender.send(err.message, null)
    else
      event.sender.send(null, res)
  }

  args.push(callback)
  _client.cmd.call.apply(_client, args)
})
