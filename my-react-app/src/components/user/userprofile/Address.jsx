import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl, Box, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AddCircleOutline, Edit, Delete } from '@mui/icons-material';
import { validateFname } from '../../../utils/validation';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

const Address = ({ selectedAddress, handleAddressChange }) => {
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    pincode: '',
    locality: '',
    district: '',
    state: 'Kerala',
    altPhoneNumber: '',
    type: 'home',
    message: '',
  });
  const [errors, setErrors] = useState({});
  
  const userId = localStorage.getItem('userId');
  console.log('user id in address: ', userId);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFormData({
      id: '',
      name: '',
      phoneNumber: '',
      pincode: '',
      locality: '',
      district: '',
      state: 'Kerala',
      altPhoneNumber: '',
      type: 'home',
      message: '',
    });
    setErrors({});
  };

  const fetchAddress = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/user/getAddress/${userId}`);
      console.log('add fetch res: ', response?.data);
      setAddress(response?.data?.addresses);
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAddressSelect = (addressId) => {
    handleAddressChange(addressId); // Pass the selected address ID to the parent
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidation = () => {
    const newErrors = {};
    if (validateFname(formData.name)) {
      newErrors.name = 'Name is required and should be a valid string.';
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }
    if (!formData.locality) {
      newErrors.locality = 'Locality is required.';
    }
    if (!formData.district) {
      newErrors.district = 'District is required.';
    }
    if (formData.altPhoneNumber && !/^\d{10}$/.test(formData.altPhoneNumber)) {
      newErrors.altPhoneNumber = 'Alternative phone number must be 10 digits if provided.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!handleValidation()) return;
    try {
      if (formData.id) {
       const response = await axiosInstance.patch(
          `/user/updateAddress/${formData.id}`,
          formData
        );
        toast.success(response.data?.message || 'Address updated successfully');
      } else {
        const response = await axiosInstance.post(
          `/user/addAddress/${userId}`,
          formData
        );
        toast.success(response.data?.message || 'Address added successfully');
      }
      fetchAddress();
      setOpen(false);
    } catch (error) {
      console.error('Error saving address:', error.message);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };
  

  const handleEditAddress = (address) => {
    console.log('Edit address:', address);
    setFormData({
      id: address._id,
      name: address.name,
      phoneNumber: address.phoneNumber,
      pincode: address.pincode,
      locality: address.locality,
      district: address.district,
      state: address.state,
      altPhoneNumber: address.altPhoneNumber || '',
      type: address.type,
    });
    setOpen(true);
  };

  const handleDeleteAddress = (id) => {
    setAddressToDelete(id);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/user/deleteAddress/${addressToDelete}`);
      toast.success(response.data?.message);
      fetchAddress();
    } catch (error) {
      toast.error('Error deleting address');
    } finally {
      setConfirmationOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationOpen(false);
    setAddressToDelete(null);
  };

  const states = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana'];

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={handleOpenModal}
        >
          Add Address
        </Button>
      </Box>
      {/* Display Address or Button to Add */}
      <>
      {address && address.length > 0 ? (
        address.map((addr) => (
          <Box
            key={addr._id}
            sx={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              backgroundColor:
                selectedAddress === addr._id ? '#e3f2fd' : 'white', // Highlight selected address
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px',
              }}
            >
              {addr.name}
            </Typography>

            <Box
              sx={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '16px',
                backgroundColor: addr.type === 'home' ? '#e3f2fd' : '#e8f5e9',
                color: addr.type === 'home' ? '#1565c0' : '#2e7d32',
                fontWeight: 'normal',
                textTransform: 'uppercase',
                fontSize: '14px',
                letterSpacing: '1px',
                fontFamily: `'Poppins', sans-serif`,
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              {addr.type}
            </Box>

            <Typography sx={{ color: '#555', lineHeight: 1.6, marginTop: '8px' }}>
              {`${addr.phoneNumber}`}
              <br />
              {`${addr.locality}, ${addr.pincode}`}
              <br />
              {`${addr.district}, ${addr.state}`}
            </Typography>

            <Box
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <IconButton
                onClick={() => handleEditAddress(addr)}
                sx={{ color: '#1565c0' }}
              >
                <Edit />
              </IconButton>

              <IconButton
                onClick={() => handleDeleteAddress(addr._id)}
                sx={{ color: '#d32f2f' }}
              >
                <Delete />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAddressSelect(addr._id)} // Call select handler
              sx={{
                marginTop: '16px',
                width: '100%',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {selectedAddress === addr._id ? 'Selected' : 'Select'}
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No address added</Typography>
      )}
    </>

      {/* Add/Edit Address Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            maxWidth: 600,
            margin: 'auto',
            marginTop: '5%',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            overflowY: 'auto',
            maxHeight: '75vh',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '15px' }}>
            {formData.name ? 'Edit Address' : 'Add Address'}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '15px' }}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '15px' }}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />

          <Box sx={{ display: 'flex', gap: '20px' }}>
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: '15px' }}
              error={!!errors.pincode}
              helperText={errors.pincode}
            />
            <TextField
              label="Locality"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: '15px' }}
              error={!!errors.locality}
              helperText={errors.locality}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: '20px' }}>
            <TextField
              label="District"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: '15px' }}
              error={!!errors.district}
              helperText={errors.district}
            />
            <FormControl fullWidth sx={{ marginBottom: '15px' }}>
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                label="State"
                error={!!errors.state}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Alternative Phone Number (Optional)"
            name="altPhoneNumber"
            value={formData.altPhoneNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '15px' }}
            error={!!errors.altPhoneNumber}
            helperText={errors.altPhoneNumber}
          />

          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <InputLabel>Address Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Address Type"
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="office">Office</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="outlined" onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveAddress} color="primary">
              Save Address
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Dialog open={confirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this address?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Address;
