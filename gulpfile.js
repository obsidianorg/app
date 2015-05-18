var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var dirs = ['./tasks']
dirs = dirs.map(_.partial(_.ary(path.join, 2), __dirname))

dirs.forEach(function (d) {
  fs.readdirSync(d).forEach(function (f) {
    f = path.join(d, f)
    fs.lstatSync(f).isFile() && require(f)
  })
})
