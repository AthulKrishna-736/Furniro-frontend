import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OtpPage from './pages/OtpPage'
import Home from './pages/Home'
import ProtectedRoute from './pages/ProtectedRoute'
import AuthProtect from './pages/AuthProtect'
import store from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>

      <Route path='/login' element={<AuthProtect> <LoginPage /> </AuthProtect>} />
        <Route path='/signup' element={<AuthProtect> <SignUpPage /> </AuthProtect>} />
        <Route path='/otpverify' element={<AuthProtect> <OtpPage /> </AuthProtect>} />

        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
          } />
      </Routes>
    </Router>
    </Provider>
  )
}

export default App;