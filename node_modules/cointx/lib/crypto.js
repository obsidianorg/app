var crypto = require('crypto')

function hash160(buffer) {
  return ripemd160(sha256(buffer))
}

function hash256(buffer) {
  return sha256(sha256(buffer))
}

function ripemd160(buffer) {
  return crypto.createHash('rmd160').update(buffer).digest()
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}

module.exports = {
  ripemd160: ripemd160,
  sha256: sha256,
  hash160: hash160,
  hash256: hash256
}
