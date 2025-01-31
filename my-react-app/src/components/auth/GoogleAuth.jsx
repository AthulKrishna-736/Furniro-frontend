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

        const { userId, userEmail } = res.data;

        localStorage.setItem('userId', userId);
        localStorage.setItem('email', userEmail)
        showSuccessToast('Google Login Successful!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showErrorToast('Your account is blocked by the admin. Please contact support.');
      } else {
        showErrorToast('Google login failed. Please try again.');
      }
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
