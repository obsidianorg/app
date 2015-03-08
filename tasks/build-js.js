var fs = require('fs-extra')
var gulp = require('gulp')
var livereload = require('gulp-livereload')
var pkg = require('../package')

gulp.task('watch-js', function() {
  var watch = require('gulp-watch')
  livereload.listen()

  watch(['package.json', "src/**/*.js", "src/**/*.json", "!src/renderer/js/_bundle.js"], function() {
    return gulp.start("build-js")
  })

  gulp.start("build-js")
})

gulp.task('build-js', function() {
  var gutil = require('gulp-util')
  var browserify = require('browserify')
  var path = require('path')
  var source = require('vinyl-source-stream')
  //var watchify = require('watchify')
  //var _ = require('lodash')

  // need `browser` field for building
  fs.writeJsonSync('./src/package.json', pkg)

  var file = './src/renderer/js/index.js'
  //var opts = _.extend({debug: true}, watchify.args)
  var b = browserify({debug: true})

  b.transform('reactify')

  b.add(file)
  //b.require('./config/dev.js', {expose: 'config'})
  b.on('update', rebundle)

  function rebundle(files) {
    var start = Date.now()
    files && files.forEach(function(file) {
      gutil.log(gutil.colors.magenta(path.basename(file)), 'was changed')
    })

    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('_bundle.js'))
      .pipe(gulp.dest('./src/renderer/js/'))
      .pipe(livereload())
      .on('end', function() {
        var diff = ((Date.now() - start)/1000).toFixed(2) + ' s'
        gutil.log('Browserify finished after', gutil.colors.magenta(diff))
      })
  }

  return rebundle()
})
