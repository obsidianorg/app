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
    callback.apply(this, arguments)
  })
}
