import React from 'react';
import { Box, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import AdminSidebar from '../../components/sidebar/AdminSidebar';
import AdminNavbar from '../../components/header/AdminNav';
import SalesReport from '../../components/salesReport/SalesReport';

const SalesReportPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, marginLeft: '250px', padding: 3 }}>
        <AdminNavbar />
        <Container maxWidth="lg">
          <SalesReport/>
        </Container>
      </Box>
    </Box>
  );
};

export default SalesReportPage;
