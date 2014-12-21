var React = require('react')

var Sidebar = React.createClass({
  render: function() {
    return (
      <aside>
        <div id="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a className="active" href="index.html">
                <i className="fa fa-dashboard"></i>
                <span>Accounts</span>
              </a>
            </li>
            <li>
              <a href="#" >
                <i className="fa fa-cogs"></i>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    )
  }
})

module.exports = Sidebar    
