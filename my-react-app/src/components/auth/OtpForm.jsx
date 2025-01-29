import React, { useEffect, useState } from 'react';
import { Typography, Box, Modal, IconButton, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

const OtpFormModal = ({ open, onClose, email, setOtpVerified, isSignup }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true); 
  

  const startTimer = () => {
    setTimer(60);
    setResendDisabled(true);

    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); 
          setResendDisabled(false); 
          return 0;
        }
        return prev - 1; 
      });
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      if (isSignup) {
        startTimer(); 
        requestOtp();
      } else {
        startTimer();
        requestOtp();
      }
    }
  }, [open, isSignup]);

  const requestOtp = async (isResend) => {
    try {
      const response = await axiosInstance.post('/user/createOtp', { email, isSignup: isSignup });
      showSuccessToast(response?.data?.message);
    } catch (error) {
      showErrorToast('Failed to send OTP. Please try again.');
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      setError('Please enter numbers only');
      return;
    }
    setError('');
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = '';
        return newOtp;
      });
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/user/otpVerify', { email, otp: otpString });
      if (response.data.success) {
        showSuccessToast(response.data.message || 'OTP verified successfully');
        setOtpVerified(true);
        setOtp(['', '', '', '', '', '']);
        onClose();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    onClose();
  };
  
  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    requestOtp();
    startTimer();
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: '90%',
          maxWidth: '500px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: '#000',
            '&:hover': {
              backgroundColor: 'red',
              color: 'white',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ marginBottom: 4 }}>
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
            OTP Verification
          </Typography>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Typography sx={{ mt: 2 }}>Time Remaining: {Math.floor(timer / 60)}:{`0${timer % 60}`.slice(-2)}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                style={{
                  width: '60px',
                  height: '60px',
                  fontSize: '28px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: '2px solid #ddd',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  color: '#333',
                  fontWeight: 'bold',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              />
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 3,
            position: 'relative',
            padding: '12px 20px',
            background: '#111',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '10px',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleResendOtp}
          disabled={resendDisabled}
          sx={{
            mt: 2,
            borderRadius: '10px',
          }}
        >
          Resend OTP
        </Button>
      </Box>
    </Modal>
  );
};

export default OtpFormModal;
