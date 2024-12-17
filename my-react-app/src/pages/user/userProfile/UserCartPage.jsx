import React from 'react';
import { Box, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Navbar from '../../../components/header/Navabar';
import Cart from '../../../components/user/userprofile/Cart';

const UserCartPage = () => {
  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Cart Heading */}
      <Box sx={{ maxWidth: '1200px', margin: '20px auto' , marginTop:'100px'}}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Your Cart
        </Typography>
      </Box>

      {/* Cart Component with margin top */}
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '40px auto 20px', 
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <Cart />
      </Box>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </Box>
  );
};

export default UserCartPage;
