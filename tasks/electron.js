var childProcess = require('child_process')
var fs = require('fs-extra')
var os = require('os')
var ospath = require('ospath')
var path = require('path')
var download = require('electron-download')
var gulp = require('gulp')
var gutil = require('gulp-util')
var latest = require('github-latest-release')
var extract = require('extract-zip')
var minimist = require('minimist')
var packager = require('electron-packager')
var pkg = require('../package')
var _ = require('lodash')
var spawn = childProcess.spawn

var _args = minimist(process.argv.slice(2))

var CACHE_PATH = path.join(ospath.home(), '.cache', 'electron', os.platform())
var _latestElectronVersion
var CURRENT = '0.28.3'

gulp.task('electron:build:mac', _args.v ? [] : ['electron:build:prepare', 'electron:latest'], function (done) {
  var version = _args.v || _latestElectronVersion || CURRENT
  var buildDir = path.join(os.tmpdir(), pkg.name)

  var opts = {
    dir: buildDir,
    name: pkg.productName,
    platform: 'darwin',
    version: version,
    arch: 'x64',
    out: path.join(process.cwd(), '/release', pkg.name + '-darwin-' + pkg.version),
    icon: './static/res/icon.icns',
    asar: true
  }

  packager(opts, function (err, appPath) {
    if (err) {
      gutil.log('ERROR: ' + err.message)
    } else {
      gutil.log('Successfully built ' + appPath)
    }
  })
})

gulp.task('electron:build:linux', _args.v ? [] : ['electron:build:prepare', 'electron:latest'], function (done) {
  var version = _args.v || _latestElectronVersion || CURRENT
  var buildDir = path.join(os.tmpdir(), pkg.name)

  var opts = {
    dir: buildDir,
    name: pkg.productName,
    platform: 'linux',
    version: version,
    arch: 'x64',
    out: path.join(process.cwd(), '/release', pkg.name + '-linux-' + pkg.version),
    asar: true
  }

  packager(opts, function (err, appPath) {
    if (err) {
      gutil.log('ERROR: ' + err.message)
    } else {
      gutil.log('Successfully built ' + appPath)
    }
  })
})

gulp.task('electron:build:windows', _args.v ? [] : ['electron:build:prepare', 'electron:latest'], function (done) {
  var version = _args.v || _latestElectronVersion || CURRENT
  var buildDir = path.join(os.tmpdir(), pkg.name)

  var opts = {
    dir: buildDir,
    name: pkg.productName,
    platform: 'win32',
    version: version,
    arch: 'x64',
    out: path.join(process.cwd(), '/release', pkg.name + '-win32-' + pkg.version),
    icon: './static/res/icon.ico',
    asar: true
  }

  packager(opts, function (err, appPath) {
    if (err) {
      gutil.log('ERROR: ' + err.message)
    } else {
      gutil.log('Successfully built ' + appPath)
    }
  })
})

gulp.task('electron:build:prepare', function () {
  var buildDir = path.join(os.tmpdir(), pkg.name)
  fs.emptyDirSync(buildDir)
  // fs.emptyDirSync(path.join(process.cwd(), '/release'))

  fs.copySync('./package.json', path.join(buildDir, 'package.json'))
  fs.copySync('./src', path.join(buildDir, 'src'))
  fs.copySync('./static', path.join(buildDir, 'static'))
  Object.keys(pkg.dependencies).forEach(function (dep) {
    fs.copySync(path.join('./node_modules', dep), path.join(buildDir, 'node_modules', dep))
  })
})

gulp.task('electron:download', _args.v ? [] : ['electron:latest'], function (done) {
  var version = _args.v || _latestElectronVersion || CURRENT

  gutil.log('Downloading electron version %s', version)

  var cachePath = path.join(CACHE_PATH, version)
  var unzipPath = path.join(cachePath, 'electron')

  download({version: version, cache: cachePath}, function (err, zipPath) {
    if (err) return done(err)
    extract(zipPath, {dir: unzipPath}, function (err) {
      if (err) return done(err)
      gutil.log('downloaded!')
      done()
    })
  })
})

gulp.task('electron:latest', function (done) {
  latest('atom', 'electron').then(function (info) {
    var version = info.tag_name.slice(1) // chop off 'v'
    gutil.log('The latest electron version is: %s', version)
    _latestElectronVersion = version
    done()
  }).catch(done)
})

gulp.task('electron:run', ['scss'], function (done) {
  var version = _args.v || _.last(fs.readdirSync(CACHE_PATH))
  if (os.platform() !== 'darwin') return done(new Error('Only supports Mac OS X at the moment.'))

  var electronPath = path.join(CACHE_PATH, version.toString(), 'electron')
  if (!fs.existsSync(electronPath)) return done(new Error(electronPath + ' does not exist.'))

  electronPath += '/Electron.app/Contents/MacOS/Electron'

  var electron = spawn(electronPath, ['./'])
  electron.stdout.on('data', function (data) {
    gutil.log(data.toString('utf8'))
  })
  electron.stderr.on('data', function (data) {
    gutil.log('stderr: ' + data)
  })
  electron.on('close', function (code) {
    gutil.log('electron closed with ' + code)
  })
})
