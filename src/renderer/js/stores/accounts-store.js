var EventEmitter = require('events').EventEmitter
var util = require('util')
var blackCoinInfo = require('coininfo')('BLK')
var CoinKey = require('coinkey')
var Decimal = require('decimal.js')
var S = require('string')
var Transaction = require('cointx').Transaction
var _ = require('lodash')
var Account = require('../models/account')
var AccountConstants = require('../constants/account-constants')
var alert = require('../lib/alert')
var AppDispatcher = require('../dispatcher/app-dispatcher')
var blockchain = require('../blockchain')
var blkqt = require('../lib/blkqt')
var txUtils = require('../blockchain/txutils')

'use strict'

var CHANGE_EVENT = 'change'

function getAccountsInLocalStorage() {
  var accounts = {}
  for (var i = 0; i < window.localStorage.length; ++i) {
    var key = window.localStorage.key(i)
    if (S(key).startsWith('account:')) {
      accounts[key] = JSON.parse(window.localStorage.getItem(key))
    }
  }

  // largest balance first
  accounts = _.sortBy(accounts, function(acc) {
    return -acc.balance
  })

  return accounts
}

function removeAccountsInLocalStorage() {
  var accounts = getAccountsInLocalStorage()
  Object.keys(accounts).forEach(function(id) {
    window.localStorage.removeItem(id)
  })
}

function sync() {
  blkqt.getAccounts(function(err, accounts) {
    if (err) return console.error(err)

    // a bit inefficient to do this everytime
    removeAccountsInLocalStorage()

    accounts.forEach(function(account) {
      var id = 'account:' + account.address
      account.id = id
      window.localStorage.setItem(id, JSON.stringify(account))
    })

    AccountStore.emitChange()
  })
}

function send(data) {
  // amount to send
  try {
    var amountRat = (new Decimal(data.amount)).times(1e8).toNumber()
  } catch (err) {
    return alert.showError('amount to send: "' + data.amount + '" invalid number')
  }

  // receiver, todo, validate address
  var receiverAddress = data.address
  if (!receiverAddress)
    return alert.showError('receiver address "' + receiverAddress + '" invalid')

  blkqt.getUnspents(data.account.address, function(err, unspents) {
    if (err)
      return alert.showError('unspents problem: ' + err.message)

    console.log('WIF')
    blkqt.getWif(data.account.address, function(err, wif) {
      if (err)
        return alert.showError('wif problem: ' + err.message + '\n\nYou probably need to Unlock your wallet in BlackCoin-qt.')

       // tx fee
      var feeRat = 10000

      var key = new CoinKey.fromWif(wif)

      // amount we actually have
      var walletBalance = unspents.reduce(function(amount, unspent) {
        return unspent.value + amount
      }, 0)

      if (amountRat > (walletBalance - feeRat))
        return alert.showError('Not enough money to send.')

      var tx = new Transaction()
      tx.timestamp = Date.now() / 1000

      unspents.forEach(function(unspent) {
        tx.addInput(unspent.txId, unspent.vout)
      })

      tx.addOutput(txUtils.addressToOutputScript(receiverAddress), amountRat)

      // only receive change if there is actually change to receive
      if (walletBalance - amountRat - feeRat > 0)
        tx.addOutput(txUtils.addressToOutputScript(key.publicAddress), walletBalance - amountRat - feeRat)

      tx.ins.forEach(function(input, index) {
        txUtils.sign(tx, index, key)
      })

      var hex = txUtils.serializeToHex(tx)

      blkqt.submitTransaction(hex, function(err, txId) {
        if (err)
          return alert.showError('submit transaction error: ' + err.message)
        console.dir(JSON.stringify(txId, null, 2))
      })
    })
  })

}

var AccountStore = {}
_.mixin(AccountStore, EventEmitter.prototype)
EventEmitter.call({})

Object.defineProperty(AccountStore, 'accounts', {
  enumerable: true, configurable: true,
  get: getAccountsInLocalStorage
})

Object.defineProperty(AccountStore, 'addresses', {
  enumerable: true, configurable: true,
  get: function() {
    return _.pluck(AccountStore.accounts, 'address')
  }
})

AccountStore.emitChange = function() {
  this.emit(CHANGE_EVENT)
}

AccountStore.addChangeListener = function(callback) {
  this.on(CHANGE_EVENT, callback)
}

AccountStore.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback)
}

AppDispatcher.register(function(payload) {
  var action = payload.action

  switch (action.actionType) {
    case AccountConstants.ACCOUNT_SEND:
      send(action.data)
      break

    case AccountConstants.ACCOUNT_SYNC:
      sync(action.data)
      break

    default:
      return true
  }

  AccountStore.emitChange()

  return true
})

window.AccountStore = AccountStore
window.Account = Account

module.exports = AccountStore

// todo, change => a bit hacky
setInterval(sync, 10*1000)

