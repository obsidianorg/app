var crypto = require('crypto')

function hash256(buffer) {
  return sha256(sha256(buffer))
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}

module.exports = {
  sha256: sha256,
  hash256: hash256
}