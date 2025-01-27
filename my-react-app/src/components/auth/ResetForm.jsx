import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { validatePass } from '../../utils/validation';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';


const ResetForm = ({ open, onClose, email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // Validate Password
    const passwordValidationError = validatePass(password);
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      hasError = true;
    } else {
      setPasswordError('');
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) return;

    try {
      const response = await axiosInstance.patch('/user/resetPass', { email, password });
      navigate('/login')
      showSuccessToast(response?.data?.message)
      onClose();
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={(event, reason) => {
      // Prevent modal from closing except when X button is clicked
      if (reason !== 'backdropClick') {
        onClose();
      }
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'gray',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              color: 'red',
            },
          }}
        >
          <Close />
        </IconButton>

        {/* Form Heading */}
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
          Reset Password
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password Input */}
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password Input */}
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(''); 
            }}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
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
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ResetForm;
