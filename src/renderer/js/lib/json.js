var revivers = {
  buffer: function(k, v) {
    if (v.type !== 'Buffer')
      return v
    return new Buffer(v.data)
  }
}


module.exports = {
  revivers: revivers
}
