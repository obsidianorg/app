
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

module.exports = {
  stripCommentsAndWhitespace: stripCommentsAndWhitespace
}