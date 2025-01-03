import React from 'react';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import UserSidebar from '../../../components/sidebar/UserSidebar';
import Navbar from '../../../components/header/Navabar';
import ProfileDetails from '../../../components/profile/ProfileDetails';


const UserAccountPage = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ToastContainer/>
      {/* Navbar */}
      <Navbar />

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <UserSidebar />

        {/* Profile Details Section */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '20px',
            background: '#f9f9f9',
            overflowY: 'hidden',
          }}
        >
          <ProfileDetails />
        </Box>
      </Box>
    </Box>
  );
};

export default UserAccountPage;
