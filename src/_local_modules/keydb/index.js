import * as env from '#env'
import * as fs from 'fs-extra'
import * as Stealth from 'stealth'
import window from '#domwindow'

// temporary, renderer only
// if (process.type !== 'renderer') throw new Error('SHOULD BE RENDERER ONLY FOR NOW')
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
  var p = window.localStorage.getItem('pseudonym')

  if (fs.existsSync(env.keyFile)) {
    let data = fs.readJsonSync(env.keyFile)
    return Stealth.fromJSON(JSON.stringify(data.keys[0]))
  } else {
    let sk = loadFromLocalStorage()
    if (!sk) {
      // not in key file or localStorage, must need to create it
      sk = generateStealthKey()
    }
    var keyObj = JSON.parse(sk.toJSON())

    if (p) {
      keyObj.alias = p
    }

    var keyFileData = {
      keys: [ keyObj ]
    }
    fs.outputJsonSync(env.keyFile, keyFileData)
    return sk
  }
}

// temporary method
export function getCurrentP () {
  let data = fs.readJsonSync(env.keyFile)
  return data.keys ? data.keys[0].alias : null
}

export function resolveKeysFromP (alias) {
  let data = fs.readJsonSync(env.keyFile)
  return data.keys[0]
}
