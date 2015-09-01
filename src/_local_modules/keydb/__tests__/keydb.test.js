import assert from 'assert'
import fs from 'fs-extra'
import KeyDB from '../'
import os from 'os'
import path from 'path'

/* global it */
// trinity: mocha

// NOTE: style changed from Mocha BDD so as to easily move to tape later

function setup () {
  let testDir = path.join(os.tmpdir(), 'obsidian-keydb-load')
  fs.emptyDirSync(testDir)
  return testDir
}

function teardown (testDir) {
  fs.removeSync(testDir)
}

it('keydb: loadSync() should load database when it does not exist', function () {
  let testDir = setup()
  let testdb = path.join(testDir, 'keys.db')
  let keydb = KeyDB.create(testdb)

  keydb.loadSync()
  assert.strictEqual(keydb.keys.length, 1)

  teardown(testDir)
})

it('keydb: loadSync() should load database when it does exist', function () {
  let fixtureFile = path.join(__dirname, 'fixtures', 'keys.db.json')
  let keydb = KeyDB.create(fixtureFile)
  keydb.loadSync()
  assert.deepEqual(keydb._rawData, fs.readJsonSync(fixtureFile))

  // test .keys
  assert.strictEqual(keydb.keys.length, 2)

  // test immutability
  keydb.keys.pop()
  keydb.keys.pop()
  assert.strictEqual(keydb.keys.length, 2)
})

it('keydb: addAlias() should add alias and create new stealth key', function () {
  let testDir = setup()
  let testdb = path.join(testDir, 'keys.db')
  let keydb = KeyDB.create(testdb)

  keydb.loadSync()
  assert.strictEqual(keydb.keys.length, 1)

  let sk = keydb.addAlias('stealthy-user')
  assert.strictEqual(sk.alias, 'stealthy-user')
  assert.strictEqual(keydb.keys.length, 2)
  assert.strictEqual(keydb.keys[1].alias, 'stealthy-user')
  assert(sk.toString().length > 50) // <= make sure something is actually there
  assert.strictEqual(keydb.keys[1].toString(), sk.toString())

  // should throw exception if exists
  assert.throws(function () {
    keydb.addAlias('stealthy-user')
  })

  teardown(testDir)
})

it('keydb: saveSync() should save', function () {
  let testDir = setup()
  let testdb = path.join(testDir, 'keys.db')
  let keydb = KeyDB.create(testdb)

  keydb.loadSync()
  assert.strictEqual(keydb.keys.length, 1)

  for (let i = 1; i <= 9; ++i) {
    keydb.addAlias('stealthy-user' + i)
  }
  assert.strictEqual(keydb.keys.length, 10)

  keydb.saveSync()
  let keydb2 = KeyDB.create(testdb)
  keydb2.loadSync()

  assert.deepEqual(keydb.data, keydb2.data)

  teardown(testDir)
})
