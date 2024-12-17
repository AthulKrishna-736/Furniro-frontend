import React from 'react';
import UserSidebar from '../../../components/user/userprofile/UserSidebar'; // Import the UserSidebar component
import Address from '../../../components/user/userprofile/Address'; // Import the Address component
import { Box, Container, Grid, Typography } from '@mui/material'; // Import necessary MUI components
import { ToastContainer } from 'react-toastify'; // Toast notifications
import Navbar from '../../../components/header/Navabar'; // Import Navbar

const UserAddressPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <Box sx={{ display: 'flex', flex: 1, marginTop: '70px' }}>
        {/* Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '20px',
            background: '#f9f9f9',
            overflowY: 'auto',
            marginLeft: '300px',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            User Address
          </Typography>

          <Box sx={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: 3}}>
            <Address /> {/* Address component where the address logic is */}
          </Box>
        </Box>
      </Box>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default UserAddressPage;
