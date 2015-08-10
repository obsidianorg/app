import React from 'react'
import { provide } from 'react-redux'
import { store } from '#flux'
import Sidebar from './sidebar'
import Header from './header.react'
import Footer from './footer/index.react'
import SendForm from './send-form'

@provide(store)
export default class App extends React.Component {
  render () {
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
}

export default App
