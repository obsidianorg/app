var EventEmitter = require('events').EventEmitter
var util = require('util')
var blackCoinInfo = require('coininfo')('BC')
var CoinKey = require('coinkey')
var S = require('string')
var _ = require('lodash')
var AccountConstants = require('../constants/account-constants')
var AppDispatcher = require('../dispatcher/app-dispatcher')

'use strict'

var CHANGE_EVENT = 'change'

function create(name) {
  var ck = CoinKey.createRandom(blackCoinInfo.versions)

  //todo: encrypt
  window.localStorage.setItem('account:' + ck.publicAddress, JSON.stringify({
    id: 'account:' + ck.publicAddress, //not positive if React requires 'id' in stores, don't think so, but need to doublecheck
    wif: ck.privateWif,
    address: ck.publicAddress,
    name: name,
    amount: 0
  }))
}

var AccountStore = {}
_.mixin(AccountStore, EventEmitter.prototype)
EventEmitter.call({})

Object.defineProperty(AccountStore, 'accounts', {
  enumerable: true, configurable: true,
  get: function() {
    var accounts = {}
    for (var i = 0; i < window.localStorage.length; ++i) {
      var key = window.localStorage.key(i)
      if (S(key).startsWith('account:')) {
        accounts[key] = JSON.parse(window.localStorage.getItem(key))
      }
    }
    return accounts
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
    case AccountConstants.ACCOUNT_CREATE:
      text = action.text.trim()
      if (text !== '') create(text)
      break
    
    default:
      return true
  }

  AccountStore.emitChange()

  return true
})

window.AccountStore = AccountStore

module.exports = AccountStore
