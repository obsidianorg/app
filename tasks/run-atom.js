var childProcess = require('child_process')
var util = require('util')
var gulp = require('gulp')
var gutil = require('gulp-util')
var fs = require('fs-extra')
var pkg = require('../package')
var spawn = childProcess.spawn

var atomPkg = {
  name: pkg.name,
  version: pkg.version,
  main: './browser/index.js'
}

var ATOM_PATH = '/Applications/Atom.app/Contents/MacOS/Atom'

gulp.task('run-atom', function() {
  fs.writeJsonSync('./src/package.json', atomPkg)

  var atom = spawn(ATOM_PATH, ['src/'])
  atom.stdout.on('data', function(data) {
    gutil.log(data.toSring('hex'))
  })

  atom.stderr.on('data', function(data) {
    gutil.log('stderr: ' + data)
  })

  atom.on('close', function(code) {
    gutil.log('atom-shell closed with ' + code)
  })
})