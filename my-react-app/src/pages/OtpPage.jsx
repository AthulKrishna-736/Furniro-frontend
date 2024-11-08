import React from 'react'
import OtpForm from '../components/auth/OtpForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const OtpPage = () => {
  return (
    <div>
        <OtpForm/>
        <ToastContainer/>
    </div>
  )
}

export default OtpPage