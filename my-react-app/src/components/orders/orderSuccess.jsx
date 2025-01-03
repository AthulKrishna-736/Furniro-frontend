import React from 'react';
import { Box, Typography, Modal, Link, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = ({ open, onClose, orderDetails }) => {
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose(); 
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: 'blur(5px)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '30px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          width: '400px',
          textAlign: 'center',
        }}
      >

        {/* Close Button */}
        <IconButton
          onClick={() => onClose()}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#999',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Success Tick Animation */}
        <CheckCircleIcon
          sx={{
            fontSize: '60px',
            color: 'green',
            marginBottom: '20px',
            animation: 'pop 0.4s ease-in-out',
          }}
        />
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>

        {/* Invoice Details */}
        <Box sx={{ marginTop: '20px', textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <strong>Order ID:</strong> {orderDetails?._id}
          </Typography>
          <Typography variant="h6" sx={{ color: 'blue' }}>
            <strong>Total:</strong> ₹{orderDetails?.totalPrice}
          </Typography>
          <Typography variant="h6">
            <strong>Payment Method:</strong> {orderDetails?.paymentMethod}
          </Typography>
          <Typography variant="h6">
            <strong>Ordered By:</strong> {orderDetails?.address?.name}
          </Typography>
          <Typography variant="h6">
            <strong>Delivery Address:</strong> {orderDetails?.address?.fullAddress}
          </Typography>
          <Typography variant="h6" sx={{ color: 'red' }}>
            <strong>Status:</strong> {orderDetails?.status}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ marginTop: '20px' }}>
            <strong>Ordered Items:</strong>
          </Typography>
          {orderDetails?.cartItems?.map((item, index) => (
            <Typography key={index} variant="body1">
              {item.productName} - (x{item.quantity}) - ₹{item.price.toFixed(2)}
            </Typography>
          ))}
        </Box>

        {/* Link to Homepage */}
        <Link
          onClick={() => navigate('/home')}
          sx={{
            display: 'block',
            marginTop: '30px',
            color: 'black',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 'normal', 
            fontSize: '16px',
            textUnderlineOffset: '4px',
          }}
        >
          Go to Homepage
        </Link>
      </Box>
    </Modal>
  );
};

export default OrderSuccess;

