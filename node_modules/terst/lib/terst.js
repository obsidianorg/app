;(function(globals){

var isNode = false

//UMD
if (typeof define !== 'undefined' && define.amd) { //require.js / AMD
  define([], function() {
    return terst
  })
} else if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = terst
  isNode = process && typeof process.pid  === 'number'
  if (isNode) {
    globals = global
    var assert = require('assert')
  } else { //maybe Browserify?
    globals = window
  }
} else {
  globals.terst = terst //<script>
}

var terst = {autoMsg: false}

terst.T = function T (value, msg) {
  if (value) return
  msg = getTrueMsg(msg)

  if (isNode)
    assert(value, msg)
  else
    throw new Error(value + ' should be truthy')
}

terst.F = function F (value, msg) { 
  if (!value) return
  msg = getFalseMsg(msg)

  if (isNode)
    assert(!value, msg)
  else
    throw new Error(value + ' should be falsey')
}

terst.EQ = function EQ (val1, val2, msg) {
  if (val1 === val2) return

  msg = msg || val1 + ' should strictly equal ' + val2
  if (isNode)
    assert.strictEqual(val1, val2, msg)
  else
    throw new Error(msg)
}

terst.NEQ = function NEQ (val1, val2, msg) {
  if (val1 !== val2) return

  msg = msg || val1 + ' should not strictly equal ' + val2
  if (isNode)
    assert.notStrictEqual(val1, val2, msg)
  else
    throw new Error(msg)
}

terst.APPROX = function APPROX (value, expected, delta, msg) {
  var dlt = Math.abs(value - expected) 
  if (dlt <= delta) return

  msg = msg || value + ' should be ' + expected + ' +/- ' + delta
  throw new Error(msg)
} 

terst.THROWS = function THROWS (fn, matcher) {
  try {
    fn()
  } catch (err) {
    if (matcher && !err.message.match(matcher))
      throw new Error(matcher + ' does not match ' + err.message)
    return err
  }

  throw new Error('Did not throw.')
}

//hook up to global

var skip = ['autoMsg']
Object.keys(terst).forEach(function(key) {
  if (skip.indexOf(key) >= 0) return
  globals[key] = terst[key]
})

/// PRIVATE

//these methods are very experimental

function getTrueMsg (msg) {
  if (msg) return msg
  msg = msg || ''
  if (terst.autoMsg === true) { //experimental
    var params = getParams(T)
    for (var i = 0 ; i < params.length; ++i) {
      try {
        var e = eval(params[i].param)
      } catch (err) {
        console.error(err)
      }
      if (typeof e === 'boolean' && e === false) {
        msg = params[i].param
        return msg
      } 
    }
  }
}

function getFalseMsg (msg) {
  if (msg) return msg
  msg = msg || ''
  if (terst.autoMsg === true) { //experimental
    if (value) { //not truthy
      var params = getParams(F)
      for (var i = 0 ; i < params.length; ++i) {
        try {
          var e = eval(params[i].param)
        } catch (err) {
          console.error(err)
        }
        if (typeof e === 'boolean' && e === true) {
          msg = params[i].param
          return msg
        } 
      }
    }
  }
}

function getFnName (fn) {
  return /\W*function\s+([\w\$]+)\(/.exec(fn.toString())[1]
}

function getParam (fn, lastPos) {
  lastPos = lastPos || 0
  var name = getFnName(fn)
  var calledCode = fn.caller.toString()
  var pos1 = calledCode.indexOf(name + '(', lastPos) //reg = new RegExp('T*[\\s]?\\(')
  if (pos1 < 0)
    pos1 = calledCode.indexOf(name + ' (', lastPos)
  if (pos1 < 0 || pos1 < lastPos)
    return {param: null, pos: -1}

  var lb = calledCode.indexOf('(', pos1)
  var rb = calledCode.indexOf(')', lb)

  return {param: calledCode.substring(lb + 1 , rb), pos: rb+1}
}

function getParams (fn) {
  var params = []
  var paramData = {pos: 0}
  do {
    paramData = getParam(fn, paramData.pos)
    params.push(paramData)
  } while (paramData.pos > 0)

  //last one is always bad
  params.pop()

  return params
}

})(this);
