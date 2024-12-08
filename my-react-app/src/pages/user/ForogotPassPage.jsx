import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from '../../utils/axiosInstance'; 
import ForgotPass from '../../components/auth/ForgotPass';

const ForgotPassPage = () => {
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    // Fetch background images for the page
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get('/admin/getBanners');
        const authPageImages = response?.data?.banner?.filter(
          (image) => image.bannerLocation === 'AuthPages'
        );
        if (authPageImages.length > 0) {
          const randomIndex = Math.floor(Math.random() * authPageImages.length);
          setRandomImage(authPageImages[randomIndex].image);
        }
      } catch (error) {
        console.log('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      <CssBaseline /> {/* Adding CSSBaseline for global reset */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
          background: randomImage
            ? `url('${randomImage}') no-repeat center center/cover`
            : '#f5f5f5',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ToastContainer/>
        <ForgotPass />
      </Box>
    </>
  );
};

export default ForgotPassPage;
