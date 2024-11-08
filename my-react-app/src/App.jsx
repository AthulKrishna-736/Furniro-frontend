import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OtpPage from './pages/OtpPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginForm/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/otpverify' element={<OtpPage/>} />
      </Routes>
    </Router>
  )
}

export default App;