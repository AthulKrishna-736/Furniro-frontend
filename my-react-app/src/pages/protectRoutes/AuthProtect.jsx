import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const AuthProtect = ({ children }) => {
  const navigate = useNavigate();

  useEffect(()=>{
    const checkToken = async ()=>{
      try {
        console.log('token req gone to backend')
        const response = await axiosInstance.post('/user/verifyToken', {}, { withCredentials:true })
        console.log('Token verification success: ', response.data);

      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    checkToken()
  },[])

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (userId) {
      console.log('User is authenticated, redirecting to /home...');
      navigate('/home'); // Redirect to home if user is authenticated
    }
  }, [navigate]);

  // If userId is found in localStorage, redirect to home. Else, show login/signup
  return !localStorage.getItem('userId') ? children : null;
};

export default AuthProtect;
