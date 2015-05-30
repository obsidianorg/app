var ipc = require('ipc')

function sendIpc (data, callback) {
  data.token = Date.now() + Math.random()

  if (callback) {
    var recpMsg = data.msg + '-' + data.token
    ipc.once(recpMsg, function () {
      var args = [].slice.call(arguments)

      // error
      if (args[0]) {
        callback(new Error(args[0]))
      } else {
        callback(null, args[1])
      }
    })
  }

  ipc.send(data.msg, data)
}

module.exports = {
  sendIpc: sendIpc
}
