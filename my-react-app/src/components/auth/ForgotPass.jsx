import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CssBaseline } from '@mui/material';
import OtpFormModal from './OtpForm';
import { validateEmail } from '../../utils/validation'; // Assuming validateEmail is imported from utils
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import ResetForm from './ResetForm';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleEmail = async (event) => {
    setEmail(event.target.value);
    setError('');
  }

  const handleSendRequest = async () => {
    try {
      if (!email) {
        setError('Please enter your email');
        return;
      }
  
      const isValidEmail = validateEmail(email);
      if (isValidEmail) {
        setError('Please enter a valid email');
        return;
      }
      setError(''); 

      // rinede5388@confmin.com

      const response = await axiosInstance.post('/user/forgotPass', { email });
  
      console.log('response forgot = ', response?.data);
      
      setOtpModalOpen(true); 
      setError(''); 
      
    } catch (error) {
      console.error('Error during forgot password request:', error);
      toast.error(error.response?.data?.message)
    }
  };
  

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          margin: '0 auto', 
        }}
      >
        <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{
            padding: '16px 0', 
            color: '#000', 
            fontWeight: 'bold', 
        }}
        >
        Forgot Password
        </Typography>

        {/* Display error message if exists */}
        {error && <Typography color="error" sx={{ marginBottom: '16px' }}>{error}</Typography>}

        <TextField
          label="Enter your email"
          type="email"
          variant="outlined"
          value={email}
          onChange={handleEmail}
          fullWidth
          sx={{
            marginBottom: '16px', // Reduced margin
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: '#111',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '10px',
            textTransform: 'uppercase',
            height: '56px',
            '&:hover': {
              background: '#333',
              color: '#00b3ff',
            },
          }}
          onClick={handleSendRequest}
        >
          Send OTP
        </Button>

        {/* OTP Modal */}
        <OtpFormModal open={otpModalOpen} onClose={() => setOtpModalOpen(false)} email={email} setOtpVerified={setOtpVerified} isSignup={false} />

        {/* Reset Form */}
        {otpVerified && <ResetForm open={true} onClose={() => setOtpVerified(false)} email={email} />}
      </Box>
    </>
  );
};

export default ForgotPass;
