var cp = require('child_process')
var path = require('path')
var util = require('util')
var fs = require('fs-extra')
var gulp = require('gulp')
var asar = require('gulp-asar')
var atomshell = require('gulp-atom-shell')
var _ = require('lodash')
var pkg = require('../package')

var TMP_DIR = '/tmp/obsidian-build/linux/'
var OUT_DIR = path.join(TMP_DIR, 'obsidian')
var BUILD_ZIP_FILE = path.join(TMP_DIR, 'app.zip')
var RES_DIR = path.join(OUT_DIR, 'resources/')
var APP_DIR = RES_DIR + 'app/'
var FINAL_DIR = './release/obsidian-linux'

var ATOM_VERSION = '0.21.2'

var atomPkg = {
  name: pkg.name,
  version: pkg.version,
  main: './browser/index.js'
}

gulp.task('build-linux', ['asar-linux'], function(done) {
  fs.removeSync(BUILD_ZIP_FILE)
  fs.removeSync(APP_DIR)
  fs.ensureDirSync('./release')
  fs.move(OUT_DIR, FINAL_DIR, {clobber: true}, done)
})

gulp.task('asar-linux', ['unzip-linux'], function() {
  return gulp.src(APP_DIR + '**/*', { base: APP_DIR })
    .pipe(asar('app.asar'))
    .pipe(gulp.dest(RES_DIR))
})

gulp.task('unzip-linux', ['bundle-atom-linux'], function(done) {
  // node.js unzip libraries blow ass
  var cmd = util.format('unzip -q %s -d %s', BUILD_ZIP_FILE, OUT_DIR)

  cp.exec(cmd, function(err) {
    if (err) return console.error(err)
    done()
  })
})

gulp.task('bundle-atom-linux', function(done) {
  deleteCreateDirSync(TMP_DIR)

  fs.writeJsonSync('./src/package.json', atomPkg)
  fs.copySync('./src', path.join(TMP_DIR, 'src'))

  Object.keys(pkg.dependencies).forEach(function(dep) {
    fs.copySync(path.join('./node_modules', dep), path.join(TMP_DIR, 'src', 'node_modules', dep))
  })

  gulp.src(TMP_DIR + '/src/**')
    .pipe(atomshell({
      version: ATOM_VERSION,
      productName: 'Obsidian',
      productVersion: pkg.version,
      platform: 'linux'
    }))
    // forced to do this by package
    .pipe(atomshell.zfsdest(BUILD_ZIP_FILE))
    .on('end', done)
})

function deleteCreateDirSync(dir) {
  if (!fs.existsSync(dir))
    return fs.mkdirsSync(dir)

  // delete contents only
  fs.readdirSync(dir).map(_.partial(_.ary(path.join, 2), dir))
    .forEach(function(entry) {
      fs.removeSync(entry)
    })
}
