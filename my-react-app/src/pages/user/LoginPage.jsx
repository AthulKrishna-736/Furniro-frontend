import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <div>
        <LoginForm />
        <ToastContainer/>
    </div>
  )
}

export default LoginPage;