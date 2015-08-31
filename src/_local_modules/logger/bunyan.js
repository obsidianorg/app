var bunyan = require('bunyan')

function createBunyanStream (writeStream) {
  return {
    type: 'raw',
    level: 'info',
    stream: writeStream
  }
}

function createLogger (writeStream) {
  var logger = bunyan.createLogger({
    name: 'obsidian',
    streams: [createBunyanStream(writeStream)],
    serializers: {
      err: bunyan.stdSerializers.err
    }
  })

  return logger
}

module.exports = {
  createBunyanStream: createBunyanStream,
  createLogger: createLogger
}
