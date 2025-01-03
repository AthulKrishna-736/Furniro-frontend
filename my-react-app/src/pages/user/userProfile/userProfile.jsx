import React from 'react';
import UserSidebar from '../../../components/sidebar/UserSidebar'; 
import Navbar from '../../../components/header/Navabar'; 
import { Box, Typography } from '@mui/material';

const UserProfile = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', marginTop: '70px'}}>
      {/* Navbar at the Top */}
      <Navbar />

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '20px',
            marginLeft: '300px', 
            background: '#f9f9f9',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            User Profile
          </Typography>
          <Typography variant="body1">
            Welcome to your profile! Use the sidebar to navigate through your account, address, orders, and wallet.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
