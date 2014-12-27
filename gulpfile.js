var fs = require('fs-extra')
var path = require('path')
var gulp = require('gulp')
var gulpAtom = require('gulp-atom')
var pkg = require('./package')

var RELEASE_PATH = './release'
var ATOM_VERSION = 'v0.20.2'
var PLATFORMS = ['win32-ia32', 'darwin-x64']

gulp.task('build', ['build-atom-app'], function() {
  var filePaths = PLATFORMS.map(function(platform) {
    if (platform.indexOf('win32') != -1)
      return path.resolve(path.join(RELEASE_PATH, ATOM_VERSION, platform, 'atom.exe'))
    else if (platform.indexOf('darwin') != -1)
      return path.resolve(path.join(RELEASE_PATH, ATOM_VERSION, platform, 'Atom.app'))
  })

  filePaths.forEach(function(fp) {
    fs.rename(fp, fp.replace(/atom/i, 'Obsidian'), Function())
  })
})

gulp.task('build-atom-app', function() {
  var atomPkg = {
    name: pkg.name,
    version: pkg.version,
    main: './browser/main.js'
  }
  fs.writeJsonSync('./src/package.json', atomPkg)

  return gulpAtom({
    srcPath: './src',
    releasePath: RELEASE_PATH,
    cachePath: '/tmp/atom-cache',
    version: ATOM_VERSION,
    rebuild: false,
    platforms: PLATFORMS
  })
})

