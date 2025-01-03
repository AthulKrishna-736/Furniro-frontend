import React from 'react';
import UserSidebar from '../../../components/sidebar/UserSidebar'; 
import Address from '../../../components/address/Address'; 
import { Box, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify'; 
import Navbar from '../../../components/header/Navabar';

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
            <Address />
          </Box>
        </Box>
      </Box>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default UserAddressPage;
