var clipboard = require('clip' + 'board')
var React = require('react')
var stealth = require('../lib/stealth')

// only onefor now
var sk = stealth.load()

var Header = React.createClass({
  displayName: 'Header',

  handleClick: function (e) {
    clipboard.writeText(sk.toString())
    console.log(sk + ' copied')
  },

  render: function () {
    return (
      <header className='header' onClick={this.handleClick}>
        <div className='text-center'>
          <img src='res/logo.png' />
        </div>
      </header>
    )
  }
})

module.exports = Header
