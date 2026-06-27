import React from 'react'
import HomePage from './pages/HomePage'
import CreateAccount from './pages/CreateAccount'
import {BrowserRouter,Routes, Route} from 'react-router'
import WelcomeScreen from './pages/WelcomeScreen'
import LastPeriod from './pages/LastPeriod'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<CreateAccount />} />
            <Route path="/home" element={<HomePage />} />
            <Route path ='/welcome' element={<WelcomeScreen />} />
    <Route path='/lastperiod' element={<LastPeriod/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App