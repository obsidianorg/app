var AppDispatcher = require('../dispatcher/app-dispatcher')
var Constants = require('../constants/payment-constants')

var actions = {
  send: function (data) {
    AppDispatcher.handleViewAction({
      actionType: Constants.PAYMENT_SEND,
      data: data
    })
  },

  listen: function () {
    AppDispatcher.handleViewAction({
      actionType: Constants.PAYMENT_LISTEN,
      data: null
    })
  }
}

module.exports = actions
