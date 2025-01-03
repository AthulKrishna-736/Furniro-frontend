import React from 'react';
import Navbar from '../../../components/header/Navabar';
import UserSidebar from '../../../components/sidebar/UserSidebar';
import Wallet from '../../../components/payment/Wallet';
import { Box } from '@mui/material';

const UserWalletPage = () => {
  return (
    <Box
      sx={{
        height: '100vh', // Ensure the page height takes up the full viewport
        overflow: 'hidden', // Disable scrolling
      }}
    >
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content with sidebar and wallet details */}
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: '250px',
            padding: '0px',
            backgroundColor: '#f4f4f4',
          }}
        >
          <UserSidebar />
        </Box>

        {/* Wallet Section */}
        <Box
          sx={{
            flex: 1,
            padding: '20px',
            overflow: 'hidden', // Disable scrolling for the wallet section
          }}
        >
          <Wallet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserWalletPage;
