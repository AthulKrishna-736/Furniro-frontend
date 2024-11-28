import React from 'react'
import SignUpForm from '../../components/auth/SignupForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SignUpPage = () => {
  return (
    <div>
      <SignUpForm/>
      <ToastContainer/>
    </div>
  )
}

export default SignUpPage