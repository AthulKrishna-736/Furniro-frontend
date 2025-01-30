import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthProtect = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      navigate('/home'); 
    }
  }, [navigate]);

  return !localStorage.getItem('userId') ? children : null;
};

export default AuthProtect;
