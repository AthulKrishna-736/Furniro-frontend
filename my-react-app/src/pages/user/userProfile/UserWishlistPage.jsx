import React from 'react';
import { Box, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Navbar from '../../../components/header/Navabar';
import Wishlist from '../../../components/cart/Wishlist';

const UserWishlistPage = () => {
  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Wishlist Heading */}
      <Box sx={{ maxWidth: '1200px', margin: '20px auto', marginTop: '100px' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Your Wishlist
        </Typography>
      </Box>

      {/* Wishlist Component */}
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '40px auto 0px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <Wishlist />
      </Box>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </Box>
  );
};

export default UserWishlistPage;
