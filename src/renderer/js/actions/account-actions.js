
var AppDispatcher = require('../dispatcher/app-dispatcher')
var AccountConstants = require('../constants/account-constants')

var AccountActions = {
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
  }
}

module.exports = AccountActions
