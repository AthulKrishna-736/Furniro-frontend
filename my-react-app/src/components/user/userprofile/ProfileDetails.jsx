import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Visibility, VisibilityOff, Edit, Check } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { validatePass } from '../../../utils/validation';

const ProfileDetails = () => {
  const [editingField, setEditingField] = useState(null);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [originalDetails, setOriginalDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
  });

  const userInfo = useSelector((state) => state.userAuth.userDetails);

  useEffect(() => {
    if (userInfo) {
      setUserDetails(userInfo);
      setOriginalDetails(userInfo);
    }
  }, [userInfo, originalDetails]);


  const handleInputChange = (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear errors on edit
  };

  const validateInputs = () => {
    const { password } = userDetails;
    const newErrors = {};

    if (editingField === 'password') {
      if (!password) {
        newErrors.password = 'Password cannot be empty.';
      } else if (validatePass(password)) {
        newErrors.password = 'Password should be at least 6 characters with alphanumeric values.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSaveChanges = () => {
    if (!validateInputs()) return; 

    setConfirmationOpen(true);
  };

  const handleConfirmSaveChanges = async () => {
    const dataToSave = {
      ...originalDetails,
      password: userDetails.password !== originalDetails.password ? userDetails.password : originalDetails.password, 
    };

    try {
      const response = await axiosInstance.patch('/user/updateUserDetails', dataToSave);
      toast.success(response?.data?.message);
      console.log('res update user: ', response.data)
      setUserDetails((prev) => ({
        ...prev,
        password: userDetails.password, 
      }));

      setOriginalDetails(userDetails); 
      setConfirmationOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update details.');
    }
  };

  const hasChanges = userDetails.password !== originalDetails?.password;

  return (
    <Box
      sx={{
        padding: '40px',
        maxWidth: '700px',
        margin: '50px auto',
        background: 'linear-gradient(145deg, #f0f4f7, #ffffff)',
        borderRadius: '15px',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          marginBottom: '30px',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          color: '#333',
        }}
      >
        Profile Details
      </Typography>

      {/* Displaying fields (First Name, Last Name, Email) */}
      {['firstName', 'lastName', 'email'].map((field) => (
        <Box sx={{ marginBottom: '25px' }} key={field}>
          <TextField
            label={
              field === 'firstName'
                ? 'First Name'
                : field === 'lastName'
                ? 'Last Name'
                : 'Email'
            }
            value={userDetails[field].slice(0, 25)} // Display part of the email or name
            disabled
            fullWidth
          />
        </Box>
      ))}

      {/* Password Field */}
      <Box sx={{ marginBottom: '25px' }}>
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={userDetails.password.slice(0, 25)} // Display only part of the password
          onChange={(e) =>
            editingField === 'password' && handleInputChange('password', e.target.value)
          }
          disabled={editingField !== 'password'}
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: editingField === 'password' ? '#007bff' : '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#007bff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#007bff',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {editingField === 'password' ? (
                  <IconButton onClick={() => setEditingField(null)} sx={{ color: '#28a745' }}>
                    <Check />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => setEditingField('password')}
                    sx={{ color: '#007bff' }}
                  >
                    <Edit />
                  </IconButton>
                )}
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
      </Box>

      {/* Save Button */}
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: hasChanges ? '#007bff' : '#ccc',
            '&:hover': {
              background: hasChanges ? '#0056b3' : '#ccc',
            },
          }}
          onClick={handleSaveChanges} // Trigger validation and modal
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </Box>

      {/* Confirmation Modal */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to save these changes?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSaveChanges} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileDetails;