import React from 'react'
import { AppProvider } from './context/AppContext'
import NovaXPlatform from './components/NovaXPlatform'

function App() {
  return (
    <AppProvider>
      <NovaXPlatform />
    </AppProvider>
  )
}

export default App
