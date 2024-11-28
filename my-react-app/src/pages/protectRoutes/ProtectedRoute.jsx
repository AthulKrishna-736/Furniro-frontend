import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ProtectedRoute = ({ children }) => {
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
    if (!userId) {
      console.log('User is not authenticated. Redirecting to /login...');
      navigate('/login'); // Redirect to login if no userId is found in localStorage
    }
  }, [navigate]);

  // If user is authenticated (userId is in localStorage), render children (protected content)
  return localStorage.getItem('userId') ? children : null;
};

export default ProtectedRoute;
