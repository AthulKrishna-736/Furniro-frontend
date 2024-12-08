import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../../components/auth/LoginForm';
import { Box, CssBaseline } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

const AdminLogin = () => {
  const [bgImages, setBgImages] = useState([]);
  const [randomImage, setRandomImage] = useState('');

  // Fetch banners from the server
  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/admin/getBanners');
      console.log('res - ', response?.data?.banner)
      setBgImages(response?.data?.banner);
    } catch (error) {
      console.error('Error fetching admin banners:', error);
    }
  };

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Select a random admin-specific banner image
  useEffect(() => {
    if (bgImages.length > 0) {
      const adminPageImages = bgImages.filter((image) => image.bannerLocation == 'AuthPages');
      if (adminPageImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * adminPageImages.length);
        setRandomImage(adminPageImages[randomIndex].image);
      }
    }
  }, [bgImages]);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: randomImage
            ? `url('${randomImage}') no-repeat center center/cover`
            : '#fff',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '450px',
            padding: '20px',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LoginForm isAdmin={true} />
          <ToastContainer />
        </Box>
      </Box>
    </>
  );
};

export default AdminLogin;
