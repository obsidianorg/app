import Stealth from 'stealth'

export const STEALTH_CONSTANT = 39

export function generateStealthKey () {
  return Stealth.fromRandom({ version: STEALTH_CONSTANT })
}
