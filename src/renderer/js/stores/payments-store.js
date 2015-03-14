var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var Constants = require('../constants/payment-constants')
var AppDispatcher = require('../dispatcher/app-dispatcher')
var alert = require('../lib/alert')
var blkqt = require('../lib/blkqt')
var txUtils = require('../blockchain/txutils')

function send(data) {
  var tx = data.tx

  var hex = txUtils.serializeToHex(tx)
  console.log('raw hex: ')
  console.log(hex)

  blkqt.submitTransaction(hex, function(err, txId) {
    if (err)
      return alert.showError('Transaction submission error: ' + err.message)
    console.log(txId)
  })
}

var store = {}
_.mixin(store, EventEmitter.prototype)
EventEmitter.call(store)

AppDispatcher.register(function(payload) {
  var action = payload.action

  switch (action.actionType) {
    case Constants.PAYMENT_SEND:
      send(action.data)
      break

    default:
      return true
  }

  return true
})

module.exports = store
