import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';

const Wallet = () => {
  const walletBalance = useSelector((state) => state.userWallet.balance);

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Wallet
      </Typography>
      <Paper 
        elevation={3} 
        sx={{
          width: '100%',
          maxWidth: '600px', 
          padding: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Your Wallet Balance
        </Typography>
        <Box 
          sx={{
            mt: 3,
            py: 3,
            borderRadius: 2,
            backgroundColor: '#e3f2fd',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="h2" 
            color="primary" 
            fontWeight="bold"
          >
            ₹{walletBalance}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Wallet;
