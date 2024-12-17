import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { 
  LocalShipping as LocalShippingIcon, 
  CheckCircle as CheckCircleIcon, 
  ShoppingCartOutlined as ShoppingCartOutlinedIcon, 
  Cancel as CancelIcon, 
  ExpandMore as ExpandMoreIcon, 
  Replay as ReplayIcon,
  HourglassEmpty, 
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../../utils/toastUtils';

const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const userId = localStorage.getItem('userId');

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosInstance.get(`/user/getOrder/${userId}`);
      console.log('orders details: ', response?.data?.orders)
      setOrders(response.data.orders); 
    } catch (error) {
      console.error('Error fetching order details:', error);
      showErrorToast('Failed to fetch order details. Please try again later.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrderDetails();
    } else {
      showErrorToast('User not logged in');
    }
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axiosInstance.patch('/user/cancelOrder', { orderId });
      console.log('res cancel order', response.data)
      showSuccessToast(response.data?.message);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error returning order:', error);
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleReturnOrder = async(orderId) => {
    try {
      const response = await axiosInstance.patch('/user/returnOrder', { orderId })
      console.log('res return data: ', response.data)
      showSuccessToast(response.data?.message)
      fetchOrderDetails();
    } catch (error) {
      console.error('Error returning order:', error);
      showErrorToast(error.response.data?.message);
    }
  };

  const toggleProductList = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };  

  const steps = [
    { label: 'Pending', icon: <ShoppingCartOutlinedIcon /> },
    { label: 'Processing', icon: <HourglassEmpty /> },
    { label: 'Shipped', icon: <LocalShippingIcon /> },
    { label: 'Delivered', icon: <CheckCircleIcon /> },
  ];
  
  return (
    <Box >
      <Typography variant="h4" gutterBottom>User Orders</Typography>

      {/* Display orders with a fixed height and scrollable area */}
      <Box
        sx={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          '&::-webkit-scrollbar': {
            width: '6px', 
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#000', 
            borderRadius: '10px', 
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0', 
          },
        }}
      >
        {orders.map((order) => (
          <Box key={order._id} sx={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', position: 'relative' }}>
            <Typography 
              variant="h6" 
              sx={{
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                backgroundColor:
                order.status === 'Pending' ? '#f0ad4e' : // Amber
                order.status === 'Processing' ? '#0275d8' : // Blue
                order.status === 'Shipped' ? '#5bc0de' : // Teal
                order.status === 'Delivered' ? '#5cb85c' : // Green
                order.status === 'Cancelled' ? '#d9534f' : // Red
                order.status === 'Returned' ? '#6c757d' : // Grey
                '#6c757d', 
                color: '#ffffff', 
                padding: '5px 10px', 
                fontWeight: 'normal',
                borderRadius: '5px'
              }}
            >
              Status: {order.status}
            </Typography>

            <Typography variant="h6" gutterBottom>Order ID: {order._id}</Typography>
            <Typography variant="h6">User Name: {order.userId.firstName}</Typography>
            <Typography variant="h6">Total Price: ₹{order.totalPrice}</Typography>
            <Typography variant="h6">Payment Method: {order.payment}</Typography>
            <Typography variant="h6">Address: {order.selectedAddress}</Typography>

            {/* Progress Bar */}
            <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
  {order.status === 'Cancelled' || order.status === 'Returned' ? (
    <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
      <CancelIcon
        sx={{
          fontSize: '60px',
          marginBottom: '10px',
          color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107', // Red for Cancelled, Yellow for Returned
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107', // Red for Cancelled, Yellow for Returned
        }}
      >
        {order.status === 'Cancelled' ? 'Order Cancelled' : 'Order Returned'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#555' }}>
        {order.status === 'Cancelled'
          ? 'This order has been cancelled and is no longer being processed.'
          : 'This order has been returned successfully.'}
      </Typography>
    </Box>
  ) : (
    <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={
            order.status === 'Pending'
              ? 0
              : order.status === 'Processing'
              ? 33
              : order.status === 'Shipped'
              ? 66
              : 100
          }
          sx={{
            position: 'absolute',
            top: '20px',
            left: 0,
            width: '100%',
            height: '2px',
            borderRadius: '4px',
            backgroundColor: '#ddd',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#6c63ff',
            },
          }}
        />

        {/* Icons and Labels */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {steps.map((step, index) => {
            const stepPercentage = (index / (steps.length - 1)) * 100;
            const progressPercentage =
              order.status === 'Pending'
                ? 0
                : order.status === 'Processing'
                ? 33
                : order.status === 'Shipped'
                ? 66
                : 100;

            const isActive = stepPercentage <= progressPercentage + 1;
            const isCurrent = stepPercentage === progressPercentage;

            return (
              <Box
                key={step.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'absolute',
                  left: `${stepPercentage}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Icon Circle */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    backgroundColor: isActive || isCurrent ? '#6c63ff' : '#ddd',
                    color: isActive || isCurrent ? '#fff' : '#000',
                  }}
                >
                  {React.cloneElement(step.icon, { fontSize: '20px' })}
                </Box>

                {/* Label */}
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: '5px',
                    color: isActive || isCurrent ? '#6c63ff' : '#aaa',
                    fontSize: '12px',
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  )}
</Box>


            {/* Toggle Product List Button */}
            <Button
              onClick={() => toggleProductList(order._id)}
              sx={{
                marginTop: '15px',
                backgroundColor: '#28a745',  
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                '&:hover': {
                  backgroundColor: '#218838',  
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease', 
                '&:active': {
                  transform: 'scale(0.98)', 
                },
              }}
            >
              <ExpandMoreIcon style={{ fontSize: '20px' }} />  
              {expandedOrder === order._id ? 'Hide Products' : 'Show Products'}
            </Button>

            {/* Display Product List for the Order */}
            {expandedOrder === order._id && (
              <Box sx={{ marginTop: '20px' }}>
                {order.orderedItems.map((item) => (
                  <Box key={item.productId._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    {item.productId.images && item.productId.images[0] && (
                      <img 
                        src={item.productId.images[0]} 
                        alt={item.productId.name} 
                        style={{ width: '50px', height: '50px', marginRight: '15px' }}
                      />
                    )}
                    <Typography variant="body1" sx={{ marginRight: '15px' }}>
                      {item.productId.name}
                    </Typography>
                    <Typography variant="body2" sx={{ marginRight: '15px' }}>
                      ₹{item.productId.salesPrice}
                    </Typography>
                    <Typography variant="body2" sx={{ marginRight: '15px'}}>
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      Total: ₹{item.quantity * item.productId.salesPrice}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Return Button */}
            {order.status !== 'Cancelled' && order.status !== 'Returned' && (
              <Button
                onClick={() => handleReturnOrder(order._id)}
                sx={{
                  marginTop: '15px',
                  backgroundColor: '#6c63ff',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                  '&:hover': {
                    backgroundColor: '#5848cc', 
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease', 
                  '&:active': {
                    transform: 'scale(0.98)', 
                  },
                }}
              >
                <ReplayIcon style={{ fontSize: '20px' }} />
                Return
              </Button>
            )}

            {/* Cancel Button */}
            {order.status !== 'Cancelled' && order.status !== 'Returned' && (
              <Button
                onClick={() => handleCancelOrder(order._id)}
                sx={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '10px',
                  backgroundColor: '#e63946',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(230, 57, 70, 0.3)', 
                  '&:hover': {
                    backgroundColor: '#b32f3a',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s ease, transform 0.2s ease', 
                  '&:active': {
                    transform: 'scale(0.98)', 
                  },
                }}
              >
                <CancelIcon style={{ fontSize: '20px' }} />
                Cancel
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrderDetail;
