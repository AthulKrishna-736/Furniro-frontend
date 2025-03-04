import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
      navigate('/login'); 
    }
  }, [navigate]);

  return localStorage.getItem('userId') ? children : null;
};

export default ProtectedRoute;
