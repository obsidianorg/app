var Decimal = require('decimal.js')
var async = require('async')
var aipc = require('ipc')
var ipc = require('./ipc')

// command references
// http://we.lovebitco.in/bitcoin-qt/command-reference/
// https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list

// NEEDS refactoring, all proxied to main process, this was due to an error in
// my understanding of the relationship between main/renderer

function sendIPC (data, callback) {
  data.token = Date.now() + Math.random()

  if (callback) {
    var recpMsg = data.msg + '-' + data.token
    aipc.once(recpMsg, function () {
      var args = [].slice.call(arguments)

      // error
      if (args[0]) callback(new Error(args[0]))
      else callback(null, args[1])
    })
  }

  aipc.send(data.msg, data)
}

function sendRpc (/** args **/) {
  var args = [].slice.call(arguments)
  var callback = args.pop()

  var data = {
    msg: 'blkqt',
    args: args
  }

  ipc.sendIpc(data, callback)
}

function getAccounts (callback) {
  var data = {
    msg: 'blkqt',
    args: ['listreceivedbyaddress', 0, true]
  }

  sendIPC(data, function (err, result) {
    if (err) return callback(err)
    var accounts = result.map(function (acc) {
      acc.label = acc.account
      // acc.balance = acc.amount
      // acc.balanceRat = (new Decimal(acc.balance)).times(1e8)

      delete acc.account
      delete acc.amount

      if (!acc.label) {
        acc.label = '(no label)'
      }

      return acc
    })

    var accs = {}
    accounts.forEach(function (acc) {
      accs[acc.address] = acc
      accs[acc.address].balance = 0
      accs[acc.address].balanceRat = 0
    })

    getUnspents(null, function (err, unspents) {
      if (err) return callback(err)
      unspents.forEach(function (utxo) {
        accs[utxo.address].balance += utxo.amount
        accs[utxo.address].balanceRat += utxo.amountRat
      })

      callback(null, accounts)
    })
  })
}

function getBlock (blockHash, callback) {
  sendRpc('getblock', blockHash, callback)
}

function getBlockCount (callback) {
  sendRpc('getblockcount', callback)
}

function getBlockHash (blockHeight, callback) {
  sendRpc('getblockhash', blockHeight, callback)
}

function getNewAddress (callback) {
  var data = {
    msg: 'blkqt',
    args: ['getnewaddress']
  }

  sendIPC(data, function (err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getRawMempool (callback) {
  var data = {
    msg: 'blkqt',
    args: ['getrawmempool']
  }

  sendIPC(data, function (err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getRawTransaction (txId, callback) {
  var data = {
    msg: 'blkqt',
    args: ['getrawtransaction', txId]
  }

  sendIPC(data, function (err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

function getRawTransactionsFromBlock (blockHeight, callback) {
  getBlockHash(blockHeight, function (err, blockHash) {
    if (err) return callback(err)
    getBlock(blockHash, function (err, blockData) {
      if (err) return callback(err)
      async.mapLimit(blockData.tx, 4, getRawTransaction, function (err, rawTxs) {
        if (err) return callback(err)
        callback(null, {timestamp: blockData.time, txs: rawTxs, blockHeight: blockHeight})
      })
    })
  })
}

function getUnspents (address, callback) {
  sendRpc('listunspent', 0, function (err, result) {
    if (err) return callback(err)

    var utxos = result.filter(function (utxo) {
      if (address) {
        return utxo.address === address
      } else {
        return true
      }
    }).map(function (utxo) {
      utxo.amountRat = (new Decimal(utxo.amount)).times(1e8).toNumber()
      utxo.txId = utxo.txid
      utxo.value = utxo.amountRat

      delete utxo.txid

      return utxo
    })

    callback(null, utxos)
  })
}

function getWif (address, callback) {
  var data = {
    msg: 'blkqt',
    args: ['dumpprivkey', address]
  }

  sendIPC(data, function (err, address) {
    if (err) callback(err)
    else callback(null, address)
  })
}

function importWallet (filePath, callback) {
  sendRpc('importwallet', filePath, callback)
}

function importWif (wif, label, callback) {
  var data = {
    msg: 'blkqt',
    args: ['importprivkey', wif, label, 'false']
  }

  sendIPC(data, function (err) {
    if (err) callback(err)
    else callback(null)
  })
}

function submitTransaction (rawTx, callback) {
  var data = {
    msg: 'blkqt',
    args: ['sendrawtransaction', rawTx]
  }

  sendIPC(data, function (err, txId) {
    if (err) {
      return callback(err)
    } else {
      return callback(null, txId)
    }
  })
}

module.exports = {
  getAccounts: getAccounts,
  getBlockCount: getBlockCount,
  getNewAddress: getNewAddress,
  getRawMempool: getRawMempool,
  getRawTransaction: getRawTransaction,
  getRawTransactionsFromBlock: getRawTransactionsFromBlock,
  getUnspents: getUnspents,
  getWif: getWif,
  importWallet: importWallet,
  importWif: importWif,
  submitTransaction: submitTransaction
}
