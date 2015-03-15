var assert = require('assert')

function decode(text) {
  text = stripCommentsAndWhitespace(text)
  var lines = text.split('\n')

  var arr = []
  lines.forEach(function(line) {
    var fields = line.split(' ')

    var item = {
      wif: fields[0],
      birth: fields[1]
    }

    // label or reserve
    var lr = fields[2]

    if (lr.indexOf('label') >= 0) {
      var label = lr.split('label=')[1]
      item.label = label
      // some cases where there is no label, i.e. 'label='
      if (item.label === undefined)
        item.label = ''
      // replacing %20 with space, can't use encodeURICompoment because of '=. #' etc
      item.label = item.label.split('%20').join(' ')
    }

    if (lr.indexOf('reserve') >= 0) {
      item.reserve =  lr.split('reserve=')[1]
    }

    arr.push(item)
  })

  return arr
}

// naive / not optimally efficient, however, practically won't matter
function stripCommentsAndWhitespace(text) {
  var lines = text.split('\n')

  // strip comments
  lines = lines.map(function(line) {
    return stripCommentFromLine(line)
  })

    // filter empty lines
  lines = lines.filter(function(line) {
    return !!line.trim()
  })

  return lines.join('\n')

  function stripCommentFromLine(line, startPos) {
    startPos = ~~startPos

    var commentPos = line.indexOf('#', startPos)
    if (commentPos < 0) return line

    // first check if comment is part of label
    var labelPos = line.indexOf('label=#', startPos)
    if (labelPos > 0) return stripCommentFromLine(line, labelPos + 'label=#'.length + 1)

    // it's just a plain ole' comment, get rid of it
    return line.slice(0, commentPos).trim()
  }
}

function encode(arr) {
  var text = arr.map(function(item) {
    var line = [item.wif, item.birth].join(' ')

    assert(!('label' in item && 'reserve' in item), "Can't have both label and reserve.")
    assert('label' in item || 'reserve' in item, 'Must have at least a label or reserve.')

    if ('label' in item)
      line += ' label=' + item.label.split(' ').join('%20')
    else if ('reserve' in item)
      line += ' reserve=' + item.reserve

    return line.trim()
  }).join('\n')

  return text + '\n'
}

module.exports = {
  decode: decode,
  encode: encode,
  stripCommentsAndWhitespace: stripCommentsAndWhitespace
}
