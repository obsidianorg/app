import { keyFile } from '#env'
import fs from 'fs-extra'
import { generateStealthKey } from './stealth'
import Stealth from 'stealth'

export default class KeyDB {
  static create (file) {
    return new KeyDB(file)
  }

  constructor (file) {
    this.file = file
  }

  addAlias (alias) {
    // verify alias does not exist
    if (this._rawData.keys.some(key => key.alias === alias)) {
      throw new Error(alias + ' exists already.')
    }

    let sk = generateStealthKey()
    let skObj = sk.toJSON()
    skObj.alias = alias
    sk.alias = alias
    this._rawData.keys.push(skObj)
    this._keys.push(sk)

    return sk
  }

  loadSync () {
    if (!fs.existsSync(this.file)) {
      let sk = generateStealthKey()
      let skObj = sk.toJSON()
      skObj.alias = ''
      fs.outputJsonSync(this.file, { keys: [skObj] })
    }
    this._rawData = fs.readJsonSync(this.file)
    this._keys = this._rawData.keys.map((key) => Stealth.fromJSON(key))
    this._rawData.keys.forEach((key, i) => { this._keys[i].alias = this._rawData.keys[i].alias })
  }

  saveSync () {
    fs.writeJsonSync(this.file, this._rawData)
  }

  // immutable
  get keys () {
    return [...this._keys]
  }
}

export const keydb = new KeyDB(keyFile)
