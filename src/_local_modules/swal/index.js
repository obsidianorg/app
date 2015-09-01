import _swal from 'sweetalert'

export default function swal (args) {
  return _swal({
    customClass: 'sweet-alert-obsidian',
    ...args
  })
}

swal.confirm = function confirm (args, callback) {
  _swal({
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    customClass: 'sweet-alert-obsidian',
    ...args
  }, function () {
    return callback.apply(this, arguments)
  })
}

swal.prompt = function prompt (args, callback) {
  _swal({
    type: 'input',
    confirmButtonColor: '#DD6B55',
    showCancelButton: true,
    customClass: 'sweet-alert-obsidian',
    closeOnConfirm: false,
    // animation: 'slide-from-top',
    /* inputPlaceholder: 'Write something' */
    ...args
  }, function (cancelOrInputVal) {
    if (cancelOrInputVal === false) return true // cancel button pressed, close it
    if (typeof args.validate === 'function') {
      let message = args.validate(cancelOrInputVal)
      if (message) {
        _swal.showInputError(message)
        return false
      }
    }
    return callback.apply(this, arguments)
  })
}

swal.error = function error (args, callback) {
  _swal({
    type: 'error',
    title: 'Error',
    customClass: 'sweet-alert-obsidian',
    showCancelButton: false,
    ...args
  }, callback)
}

swal.success = function success (args, callback) {
  _swal({
    type: 'success',
    title: 'Success',
    customClass: 'sweet-alert-obsidian',
    showCancelButton: false,
    ...args
  }, callback)
}
