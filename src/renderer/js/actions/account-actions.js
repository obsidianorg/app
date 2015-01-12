
var AppDispatcher = require('../dispatcher/app-dispatcher')
var AccountConstants = require('../constants/account-constants')

var AccountActions = {
  // unused ATM
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: AccountConstants.ACCOUNT_CREATE,
      text: text
    })
  },

  send: function(data) {
    AppDispatcher.handleViewAction({
      actionType: AccountConstants.ACCOUNT_SEND,
      data: data
    })
  },

  sync: function() {
    AppDispatcher.handleViewAction({
      actionType: AccountConstants.ACCOUNT_SYNC,
      data: null
    })
  },

  // unused ATM
  updateAmounts: function() {
    AppDispatcher.handleViewAction({
      actionType: AccountConstants.ACCOUNT_UPDATE_AMOUNTS,
      data: null
    })
  }
}

module.exports = AccountActions
