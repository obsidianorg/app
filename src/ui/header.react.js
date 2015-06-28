var React = require('react')

var Header = React.createClass({
  displayName: 'Header',

  render: function () {
    return (
      <header className='header'>
        <div className='text-center'>
          <img src='res/logo.png' />
        </div>
      </header>
    )
  }
})

module.exports = Header
