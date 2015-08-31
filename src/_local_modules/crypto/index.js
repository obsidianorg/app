import crypto from 'crypto'

export function hash256 (buffer) {
  return sha256(sha256(buffer))
}

export function sha256 (buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}
