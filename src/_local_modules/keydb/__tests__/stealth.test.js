import assert from 'assert'
import { generateStealthKey, STEALTH_CONSTANT } from '../stealth'

/* global it */
// trinity: mocha

it('generateStealthKey(): should generate a stealth key with proper version', function () {
  let sk = generateStealthKey()
  assert(sk)
  assert.strictEqual(sk.toJSON().version, STEALTH_CONSTANT)
})
