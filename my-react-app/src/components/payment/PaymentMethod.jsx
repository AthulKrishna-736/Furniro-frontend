import React from 'react'
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';

const PaymentMethod = ({ paymentMethod, walletBalance, handlePaymentChange }) => {
  return (
    <Box 
    sx={{ 
        marginBottom: '30px', 
        width: '100%', 
        maxWidth: '450px', 
    }}
    >
    <Typography variant="h5" gutterBottom>
        Select Payment Method
    </Typography>

    <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
        aria-label="paymentMethod"
        name="paymentMethod"
        value={paymentMethod}
        onChange={handlePaymentChange}
        >
        {/* Cash on Delivery */}
        <Box
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
            width: '100%', 
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            }}
        >
            <FormControlLabel
            value="COD"
            control={<Radio />}
            label="Cash on Delivery (COD)"
            sx={{ flex: 1 }}
            />
            <LocalAtmIcon sx={{ marginLeft: 'auto', color: '#4caf50' }} />
        </Box>

        {/* Razorpay */}
        <Box
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
            width: '100%', 
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            }}
        >
            <FormControlLabel
            value="Razorpay"
            control={<Radio />}
            label="Razorpay"
            sx={{ flex: 1 }}
            />
            <PaymentIcon sx={{ marginLeft: 'auto', color: '#3f51b5' }} />
        </Box>

        {/* Wallet */}
        <Box
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            }}
        >
            <FormControlLabel
            value="Wallet"
            control={<Radio />}
            label={`Wallet (₹${walletBalance})`}
            sx={{ flex: 1 }}
            />
            <AccountBalanceWalletIcon sx={{ marginLeft: 'auto', color: '#ff9800' }} />
        </Box>
        </RadioGroup>
    </FormControl>
    </Box>
    );
}

export default PaymentMethod;