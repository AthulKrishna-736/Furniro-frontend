import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const OrderSummary = ({ handlePlaceOrder, totalPrice }) => {
  return (
    <Box
      sx={{
        width: '20%',
        border: '1px solid #ddd',
        padding: '20px',
        position: 'sticky',
        top: '80px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Total
      </Typography>
      <Typography variant="h6">
        Total Price: ₹{totalPrice.toFixed(2)}
      </Typography>

      <Button
        onClick={handlePlaceOrder}
        sx={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'center',
          borderRadius: '5px',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderSummary;
