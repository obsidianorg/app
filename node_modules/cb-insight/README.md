cb-insight
==========

Common Blockchain wrapper for any [Bitpay Insight API](https://github.com/bitpay/insight-api).


Common Blockchain
------------------

Common Blockchain is a concept invented by Daniel Cousens to normalize the differences between Blockchain APIs so that you can easily switch APIs if you need to.


### Canonical Example

- [cb-helloblock](https://github.com/dcousens/cb-helloblock)


### Testing Module

- [cb-tester](https://github.com/dcousens/common-blockchain)


Alternatives
------------
- [Helloblock](https://github.com/dcousens/cb-helloblock)
- [Blockr](https://github.com/weilu/cb-blockr)


API
---

### Addresses

#### summary(addresses, callback)

- **addresses**: an array of addresses or just a single address string
- **callback**: function to call upon completion. Function signature
`function(err, results)`. If an array of addresses is passed,  `results` will be an array.
If a single address is passed, then `results` will be a single result object.

**example:**

```js
var Blockchain = require('cb-insight')
var blockchain = new Blockchain('https://test-insight.bitpay.com')

var addr = 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
blockchain.addresses.summary(addr, function(err, result) {
  console.dir(result)
})
```

**returns:**

```js
{ address: 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY',
  balance: 20000,
  totalReceived: 20000,
  txCount: 1 }
```


#### unspents(addresses, callback)

- **addresses**: an array of addresses or just a single address string
- **callback**: function to call upon completion. Function signature
`function(err, utxos)`. `utxos` is an array of unspent outputs.

**example:**

```js
var Blockchain = require('cb-insight')
var blockchain = new Blockchain('https://test-insight.bitpay.com')

var addrs = [
  'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY',
  'mv3fK2ME7g9K4HswGXs6mG92e7gRgsTsqM',
  'mvJCbQvE6DgVAECMwDprASP3NMwuU53Eie',
  'mvwvsPT2J3VPEaYmFdExFc4iBGRRK2Vdkd'
]
blockchain.addresses.unspents(addrs, function(err, utxos) {
  console.dir(utxos)
})
```

**returns:**

```js
 [ { txId: 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a',
    confirmations: 41097,
    address: 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY',
    value: 20000,
    vout: 0 },
  { txId: '30d64580b02f3cbfb487c4bf58d6bcdd90caa655352620357caa14412ea7954d',
    confirmations: undefined,
    address: 'mv3fK2ME7g9K4HswGXs6mG92e7gRgsTsqM',
    value: 420000000,
    vout: 0 },
  { txId: 'f611cd3a1d676631b630600695074aab57b98ddc6982e93419438753f8f3fbda',
    confirmations: 41097,
    address: 'mv3fK2ME7g9K4HswGXs6mG92e7gRgsTsqM',
    value: 20000,
    vout: 0 },
  { txId: '41017e25bed3b740508fc10286ffd363935698bd541ac8c43d8fad52cde25220',
    confirmations: 41097,
    address: 'mvJCbQvE6DgVAECMwDprASP3NMwuU53Eie',
    value: 20000,
    vout: 0 },
  { txId: '3df7613ea58afc4c6c443cad6a8a1eaff4c5ae04e8124ec4e7204811c120101c',
    confirmations: 41098,
    address: 'mvwvsPT2J3VPEaYmFdExFc4iBGRRK2Vdkd',
    value: 20000,
    vout: 0 } ]
```




### Transactions

#### propagate(rawTxs, callback)

- **rawTxs**: an array of raw transaction hex strings, or just a single hex string
- **callback**: function to call upon completion with signature `function(err, results)`. 
If `rawTxs` is an array of hex strings, then `results` will be an array, otherwise, result is a single object.

**example:**

```js
var Blockchain = require('cb-insight')
var blockchain = new Blockchain('https://test-insight.bitpay.com')

var rawTxs = ['01000000018a3feea3ee433d5d6ff342c1a73bf67eded7a645725c7cdc4ce3f56b0f55de7d000000008b4830450221009d342a19422d2d16cfeac63b48f91d45df55d3b0e7cf60fe4c60ef337e4c742a0220230b9d2c248d4c85ab53c3efa18ab0a39ed72ab1d1926bdffbaaf9b60f5d165a0141047e646d9a2731ec1eb862e80e9fd262def4137e04dc4b9b1a04e4b1494f4748095a872ee5dd2653df252c84f553fc8d53d143920ae2508edf5798703bcb7ff1d3ffffffff01a0860100000000001976a9146ef4a59431f760a19a3dbf27fb442126f4b876f588ac00000000',
  '01000000017ab3341e35059c4c9c5dc7b77b19d8054d69f496a2899b54225ca77bac7f07dd000000008b483045022100ac8f8a90fd735ddcf87ed4f89531977dd350797c84d4709b3dfef2083dad52a102200166b7407e7033763b6c22b8be56d8f7c549515d2b84db641b7f0172554765be0141047e646d9a2731ec1eb862e80e9fd262def4137e04dc4b9b1a04e4b1494f4748095a872ee5dd2653df252c84f553fc8d53d143920ae2508edf5798703bcb7ff1d3ffffffff0110270000000000001976a9146ef4a59431f760a19a3dbf27fb442126f4b876f588ac00000000',
  '01000000016a74d477e69af1ad1e336a44a0ddd675d8fab89520c321a77c58884e7a6a0595000000008b4830450221009ee7da1c2921c999413503bd4dc289c0d7bef2f55b63033048aba99ff3c98c3b02202256d291fc1deb62d91c4b959586d69f33ec3df982775c869d4e34d15a5034370141047e646d9a2731ec1eb862e80e9fd262def4137e04dc4b9b1a04e4b1494f4748095a872ee5dd2653df252c84f553fc8d53d143920ae2508edf5798703bcb7ff1d3ffffffff0150c30000000000001976a9146ef4a59431f760a19a3dbf27fb442126f4b876f588ac00000000']

blockchain.transactions.propagate(rawTxs, function(err, results) {
  console.dir(results)
})
```

**returns:**

```js
[ { txId: 'cbcd40a9c3bff0e85ef3d369fb6d797ac5a21ba5ce6ab0e76a3f3ca2d622824d' },
  { txId: '6214938d01883b1904e42ea9ecd3349a06f0cb16298825ad33727031f8a57a8b' },
  { txId: 'acfdcf2de5ad16d046b90fc6bc60b888005398014f7e2d60905887cd23bcf9d9' } ]
```


