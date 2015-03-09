// thwart browserify, setting browser field doesn't
// seem to work in watch scripts
var ipc = require('i' + 'pc')
var Decimal = require('decimal.js')

// command references
// http://we.lovebitco.in/bitcoin-qt/command-reference/
// https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list

function sendIPC(data, callback) {
  data.token = Date.now() + Math.random()

  if (callback) {
    var recpMsg = data.msg + '-' + data.token
    ipc.once(recpMsg, function() {
      var args = [].slice.call(arguments)

      // error
      if (args[0])
        callback(new Error(args[0]))
      else
        callback(null, args[1])
    })
  }

  ipc.send(data.msg, data)
}

function getAccounts(callback) {
  var data = {
    msg: 'blkqt',
    args: ['listreceivedbyaddress', 0, true]
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)
    var accounts = result.map(function(acc) {
      acc.label = acc.account
      //acc.balance = acc.amount
      //acc.balanceRat = (new Decimal(acc.balance)).times(1e8)

      delete acc.account
      delete acc.amount

      if (!acc.label)
        acc.label = '(no label)'

      return acc
    })

    var accs = {}
    accounts.forEach(function(acc) {
      accs[acc.address] = acc
      accs[acc.address].balance = 0
      accs[acc.address].balanceRat = 0
    })

    getUnspents(null, function(err, unspents) {
      unspents.forEach(function(utxo) {
        accs[utxo.address].balance += utxo.amount
        accs[utxo.address].balanceRat += utxo.amountRat
      })

      callback(null, accounts)
    })
  })
}

function getBlockCount(callback) {
  var data = {
    msg: 'blkqt',
    args: ['getblockcount']
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getNewAddress() {
  var data = {
    msg: 'blkqt',
    args: ['getnewaddress']
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getRawMempool(callback) {
  var data = {
    msg: 'blkqt',
    args: ['getblockcount']
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getRawTransaction(txId, callback) {
  var data = {
    msg: 'blkqt',
    args: ['getrawtransaction', txId]
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getUnspents(address, callback) {
  var data = {
    msg: 'blkqt',
    args: ['listunspent', 0]
  }

  sendIPC(data, function(err, result) {
    if (err) return callback(err)

    var utxos = result.filter(function(utxo) {
      if (address)
        return utxo.address === address
      else
        return true
    }).map(function(utxo) {
      utxo.amountRat = (new Decimal(utxo.amount)).times(1e8)
      utxo.txId = utxo.txid
      utxo.value = utxo.amountRat

      delete utxo.txid

      return utxo
    })

    callback(null, utxos)
  })
}

function getWif(address, callback) {
  var data = {
    msg: 'blkqt',
    args: ['dumpprivkey', address]
  }

  sendIPC(data, function(err, address) {
    if (err)
      callback(err)
    else
      callback(null, address)
  })
}

function importWif(wif, label, callback) {
  var data = {
    msg: 'blkqt',
    args: ['importprivkey', wif, label, 'false']
  }

  sendIPC(data, function(err) {
    if (err)
      callback(err)
    else
      callback(null)
  })
}

function submitTransaction(rawTx, callback) {
  var data = {
    msg: 'blkqt',
    args: ['sendrawtransaction', rawTx]
  }

  sendIPC(data, function(err, txId) {
    if (err)
      return callback(err)
    else
      return callback(null, txId)
  })
}

module.exports = {
  getAccounts: getAccounts,
  getBlockCount: getBlockCount,
  getNewAddress: getNewAddress,
  getRawMempool: getRawMempool,
  getRawTransaction: getRawTransaction,
  getUnspents: getUnspents,
  getWif: getWif,
  importWif: importWif,
  submitTransaction: submitTransaction
}

