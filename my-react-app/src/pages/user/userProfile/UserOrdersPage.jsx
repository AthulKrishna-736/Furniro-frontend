import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from '../../../components/header/Navabar';
import UserSidebar from '../../../components/user/userprofile/UserSidebar';
import OrderDetail from '../../../components/user/userprofile/OrderDetail'
import { Box } from '@mui/material';
 
const UserOrdersPage = () => {
    return (
      <Box>
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content with sidebar and order details */}
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#f4f4f4',
          }}
        >
          <UserSidebar />
        </Box>

        {/* Order Details Section */}
        <Box
          sx={{
            flex: 1,
            padding: '20px',
            marginTop: '40px',
            overflowY: 'hidden',
          }}
        >
          <OrderDetail />
        </Box>
      </Box>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
    );
  };
  
  export default UserOrdersPage;
  