/* global window */

// useful for mocking / tests
// renderer
if (global.constructor.name === 'Window') {
  module.exports = window
// main
} else {
  module.exports = {}
}
