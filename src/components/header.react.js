var React = require('react')

var Header = React.createClass({
  displayName: 'Header',

  handleClick: function (e) {},

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
