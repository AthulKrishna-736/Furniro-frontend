import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Tooltip,
  Avatar,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Edit, Check, ContentCopy } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { validatePass } from '../../utils/validation';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import AlertConfirm from '../customAlert/AlertConfirm';

const ProfileDetails = () => {
  const [editingField, setEditingField] = useState(null);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    referralCode: '',
    newReferralCode: '',
  });
  const [originalDetails, setOriginalDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [errors, setErrors] = useState({ password: '', referralCode: '' });
  const email = localStorage.getItem('email');

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.post('/user/getUserDetail', { email });
      setUserDetails(response.data.user);
      setOriginalDetails(response.data?.user);
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to fetch user details.');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateInputs = () => {
    const newErrors = {};
    const { password, newReferralCode } = userDetails;

    if (editingField === 'password') {
      if (!password) newErrors.password = 'Password cannot be empty.';
      else if (validatePass(password)) newErrors.password = 'Password should be at least 6 characters with alphanumeric values.';
    }

    if (editingField === 'referralCode' && newReferralCode && !/^[a-zA-Z0-9]{6,}$/.test(newReferralCode)) {
      newErrors.referralCode = 'Referral code must be alphanumeric and at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePassword = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axiosInstance.patch('/user/updateUserDetails', { email: email, password: userDetails.password });
      showSuccessToast(response?.data?.message || 'Password updated successfully.');
      fetchUserDetails();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleSaveReferralCode = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axiosInstance.patch(`/user/referral?referralCode=${encodeURIComponent(userDetails.newReferralCode)}`, { email: email });
      showSuccessToast(response?.data?.message || 'Referral code applied successfully.');
      fetchUserDetails();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to apply referral code.');
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userDetails.referralCode);
    showSuccessToast('Referral code copied to clipboard!');
  };

  return (
    <Box
      sx={{
        padding: '40px',
        maxWidth: '800px',
        margin: '50px auto',
        background: 'linear-gradient(145deg, #f0f4f7, #ffffff)',
        borderRadius: '20px',
        boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
        <Avatar
          sx={{
            width: '100px',
            height: '100px',
            margin: '0 auto 15px',
            backgroundColor: '#007bff',
            fontSize: '40px',
          }}
        >
          {userDetails.firstName?.charAt(0).toUpperCase() || 'U'}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: '10px' }}>
          {userDetails.firstName} {userDetails.lastName}
        </Typography>

        <Typography variant="body2" sx={{ color: 'gray', marginBottom: '20px' }}>
          {userDetails.email}
        </Typography>

        <Divider sx={{ marginBottom: '20px' }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '18px', marginBottom: '5px' }}>
              Referral Code:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '16px', marginRight: '15px' }}>
              {userDetails.referralCode}
            </Typography>
            <Tooltip title="Copy Referral Code">
              <IconButton onClick={copyReferralCode} sx={{ color: '#007bff', fontSize: '20px' }}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '18px', marginBottom: '5px' }}>
              Referred By:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '18px', marginRight: '15px' }}>
              {userDetails.referredBy ? userDetails.referredBy : 'No one referred you yet.'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: '20px', marginBottom: '20px' }} />

        {!userDetails.isGoogleUser && (
          <Box sx={{ marginBottom: '25px' }}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={userDetails.password.slice(0, 15) || ''}
              onChange={(e) => editingField === 'password' && handleInputChange('password', e.target.value)}
              disabled={editingField !== 'password'}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: editingField === 'password' ? '#007bff' : '#ccc',
                  },
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setEditingField(editingField === 'password' ? null : 'password')}
                      sx={{ color: editingField === 'password' ? '#28a745' : '#007bff' }}
                    >
                      {editingField === 'password' ? <Check /> : <Edit />}
                    </IconButton>
                    {editingField === 'password' && (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ marginLeft: '10px' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSavePassword}
              sx={{
                marginTop: '15px',
                padding: '8px 16px',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'none',
                borderColor: '#007bff',
                color: '#007bff',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#007bff',
                  color: '#fff',
                },
              }}
            >
              Save Password
            </Button>
          </Box>
        )}

        <Box sx={{ marginBottom: '25px' }}>
          <TextField
            label="Enter Referral Code for Offers"
            type="text"
            value={userDetails.newReferralCode || ''}
            onChange={(e) => editingField === 'referralCode' && handleInputChange('newReferralCode', e.target.value)}
            disabled={editingField !== 'referralCode'}
            fullWidth
            error={!!errors.referralCode}
            helperText={errors.referralCode}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: editingField === 'referralCode' ? '#007bff' : '#ccc',
                },
                '&:hover fieldset': { borderColor: '#007bff' },
                '&.Mui-focused fieldset': { borderColor: '#007bff' },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setEditingField(editingField === 'referralCode' ? null : 'referralCode')}
                    sx={{ color: editingField === 'referralCode' ? '#28a745' : '#007bff' }}
                  >
                    {editingField === 'referralCode' ? <Check /> : <Edit />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            sx={{
              marginTop: '15px',
              padding: '8px 16px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'none',
              borderColor: '#007bff',
              color: '#007bff',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#007bff',
                color: '#fff',
              },
            }}
            onClick={handleSaveReferralCode}

          >
            Save Referral Code
          </Button>
        </Box>
      </Paper>

      <AlertConfirm
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        title="Reset Changes"
        message="Are you sure you want to reset the changes?"
        onConfirm={() => setUserDetails(originalDetails)}
      />
    </Box>
  );
};

export default ProfileDetails;
