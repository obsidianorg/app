var childProcess = require('child_process')
var gulp = require('gulp')
var gutil = require('gulp-util')
var spawn = childProcess.spawn

var ELECTRON_PATH = '/Applications/Atom.app/Contents/MacOS/Atom'
// var ELECTRON_PATH = '/Applications/Electron.app/Contents/MacOS/Electron'

gulp.task('run', ['scss'], function () {
  var atom = spawn(ELECTRON_PATH, ['./'])
  atom.stdout.on('data', function (data) {
    gutil.log(data.toString('utf8'))
  })

  atom.stderr.on('data', function (data) {
    gutil.log('stderr: ' + data)
  })

  atom.on('close', function (code) {
    gutil.log('atom-shell closed with ' + code)
  })
})
