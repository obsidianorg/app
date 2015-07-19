import * as env from '@env'
import * as fs from 'fs-extra'
import * as Stealth from 'stealth'
import window from '@domwindow'

// temporary, renderer only
// todo: fix stealth to/from JSON

const STEALTH_CONSTANT = 39
const LS_KEY = 'sk' // localStorage only for old compatibility

export function generateStealthKey () {
  return Stealth.fromRandom({ version: STEALTH_CONSTANT })
}

export function loadFromLocalStorage () {
  var skData = window.localStorage.getItem(LS_KEY)
  if (!skData) return null
  return Stealth.fromJSON(skData)
}

export function load () {
  return loadSync()
}

export function loadSync () {
  if (fs.existsSync(env.keyFile())) {
    let data = fs.readJsonSync(env.keyFile())
    return Stealth.fromJSON(JSON.stringify(data.keys[0]))
  } else {
    let sk = loadFromLocalStorage()
    if (sk) return sk

    // not in key file or localStorage, must need to create it
    sk = generateStealthKey()
    var keyObj = JSON.parse(sk.toJSON())
    var keyFileData = {
      keys: [ keyObj ]
    }
    fs.outputJsonSync(env.keyFile(), keyFileData)
    return sk
  }
}
