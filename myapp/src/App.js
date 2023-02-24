import React from 'react'
import Content from './views/Content'
import { Provider } from 'react-redux'
import store from './redux/strore'

export default function App() {
  return (
    <div>
      <Provider store={store}>
        <Content></Content>
      </Provider>
    </div>
  )
}
