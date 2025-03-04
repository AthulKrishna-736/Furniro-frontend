import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/header/AdminNav';
import AdminSidebar from '../../components/sidebar/AdminSidebar';
import OrderTable from '../../components/orders/OrderTable';
import { Box, Typography } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { ToastContainer } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/admin/getOrders');
      if (response?.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSaveStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.patch('/admin/updateOrderStatus', {
        orderId,
        status: newStatus,
      });

      if (response?.status === 200) {
        showSuccessToast(response.data?.message)
        fetchOrders();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showErrorToast(error.response.data?.message)
    }
  };

  const handleReturnRequest = async (orderId, productId, action) => {
    try {
      const response = await axiosInstance.patch('/admin/returnProduct', {
        orderId,
        productId,
        action,
      })
      showSuccessToast(response.data.message);
      fetchOrders();
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar />
      <ToastContainer />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <AdminNavbar />

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Smaller Table */}
          <Box sx={{ width: '90%', maxWidth: '1000px', marginLeft: '200px' }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}
            >
              Orders Management
            </Typography>
            <OrderTable orders={orders} handleSaveStatus={handleSaveStatus} handleReturnRequest={handleReturnRequest} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrdersPage;