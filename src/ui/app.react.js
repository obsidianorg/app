import React from 'react'
import { TabbedArea, TabPane } from 'react-bootstrap'
import { Provider } from 'react-redux'
import { store } from '#flux'
import Sidebar from './sidebar'
import Header from './header.react'
import Footer from './footer/index.react'
import SendForm from './send-form'
import StealthKeyView from './stealth-keys/index.react'

export default class App extends React.Component {
  render () {
    return (
      <Provider store={ store }>
        { () => {
          return (
            <div id='container' >
              <Sidebar />
              <section id='main-content'>
                <Header />
                <TabbedArea defaultActiveKey={1}>
                  <TabPane eventKey={1} tab='Send'><SendForm /></TabPane>
                  <TabPane eventKey={2} tab='Stealth'><StealthKeyView /></TabPane>
                </TabbedArea>
              </section>
              <Footer />
            </div>
          )
        }}
      </Provider>
    )
  }
}

export default App
