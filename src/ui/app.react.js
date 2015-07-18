import React from 'react'
import Sidebar from './sidebar'
import Header from './header.react'
import SendForm from './send-form'

let App = React.createClass({
  displayName: 'App',

  render: function () {
    return (
      <div id='container' >
        <Sidebar />

        <section id='main-content'>
          <Header />
          <SendForm />
        </section>
      </div>
    )
  }
})

export default App
