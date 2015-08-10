import * as actions from '#flux/actions'

export function run () {

}

var blockManager = require('./lib/block-manager')

setTimeout(function () {
  blockManager.start()
    .on('error', function (err) {
      if (err) window.alert('ERROR: \n' + err)
    })
    .on('block:top', actions.blockHeight.updateTop)
    .on('block:current', function (current, top) {
      if (top - current > 100 && current % 100 === 0) actions.blockHeight.updateCurrent(current)
      if (top - current <= 100) actions.blockHeight.updateCurrent(current)
    })
}, 1000)
