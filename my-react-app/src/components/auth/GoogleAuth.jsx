import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
    const navigate = useNavigate();
  const handleLogin = async (response) => {
    try {
      if (response.credential) {
        const res = await axiosInstance.post('/user/google-login', {
          credential: response.credential,
        });

        console.log('google res = ', res.data)
        const { userId, name } = res.data;

        localStorage.setItem('userId', userId);
        showSuccessToast('Google Login Successful!');
        navigate('/home');
      }
    } catch (error) {
      showErrorToast('Google login failed');
      console.error(error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => showErrorToast('Google login failed')}
      />
    </div>
  );
};

export default GoogleAuth;
