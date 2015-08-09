import React from 'react'
import Sidebar from './sidebar'
import Header from './header.react'
import Footer from './footer/index.react'
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
        <Footer />
      </div>
    )
  }
})

export default App
