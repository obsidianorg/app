var http = require('http')

var plainType = {
  'Content-Type': 'text/plain'
}

function createListener(callback) {
  var server = http.createServer(function(req, res) {
    if (req.method !== 'POST') {
      res.writeHead(200, plainType)
      res.end('This endpoint is only to listen for POST requests for Blackcoin blocks.')
    }

    var body = ''
    req.on('data', function (data) {
      body += data
    })

    req.on('end', function () {
      callback(body)
    })
    
    res.writeHead(200, plainType)
    res.end('Thanks!\n')
  })

  return server
}

module.exports = {
  createListener: createListener
}
