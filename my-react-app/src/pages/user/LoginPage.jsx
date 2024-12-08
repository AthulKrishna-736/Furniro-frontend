import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginForm from '../../components/auth/LoginForm'
import { Box, CssBaseline } from '@mui/material'
import axiosInstance from '../../utils/axiosInstance'

const LoginPage = () => {
  const [bgImages, setBgImages] = useState([])
  const [randomImage, setRandomImage] = useState('');

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/admin/getBanners')
      setBgImages(response?.data?.banner)

    } catch (error) {
      console.log('error while fetching banners', error)
    }
  }

  useEffect(()=>{
    fetchBanners();
  },[])

  useEffect(() => {
    if (bgImages.length > 0) {
      const authPageImages = bgImages.filter((image) => image.bannerLocation === 'AuthPages');
      if (authPageImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * authPageImages.length);
        setRandomImage(authPageImages[randomIndex].image);
      }
    }
  }, [bgImages]);

  return (
    <>
      <CssBaseline /> {/* Resets default margins/paddings */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', 
          background: randomImage
          ? `url('${randomImage}') no-repeat center center/cover` : '',          backgroundColor: '#f5f5f5',
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
          <LoginForm />
          <ToastContainer />
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
