import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../../components/auth/LoginForm';


const AdminLogin = () => {
  return (
    <div>
        <LoginForm isAdmin={true} />
        <ToastContainer/>
    </div>
  )
}

export default AdminLogin