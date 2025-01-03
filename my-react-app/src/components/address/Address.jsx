import React, { useEffect, useState } from 'react';
import { Button, Box, IconButton, Typography, Radio } from '@mui/material';
import { Edit, DeleteOutlineOutlined, AddLocationAltOutlined } from '@mui/icons-material';
import { validateFname } from '../../utils/validation';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { useLocation } from 'react-router-dom';
import AlertConfirm from '../customAlert/AlertConfirm';
import AddressModal from './AddressModal';

const Address = ({ selectedAddress, handleAddressChange }) => {
  const location = useLocation();
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
      setAddress(response?.data?.addresses);
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

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

        showSuccessToast(response.data?.message);
      } else {
        const response = await axiosInstance.post(
          `/user/addAddress/${userId}`,
          formData
        );
        showSuccessToast(response.data?.message);
      }
      fetchAddress();
      handleCloseModal();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'An error occurred');
    }
  };
  

  const handleEditAddress = (address) => {
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
      showSuccessToast(response.data?.message);
      fetchAddress();
    } catch (error) {
      showErrorToast(error.response.data?.message);
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
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Button
          sx={{
            fontSize: '1rem', 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 15px', 
          }}
          onClick={handleOpenModal}
        >
          <AddLocationAltOutlined fontSize="medium" sx={{ color: '#007BFF' }} />
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
                backgroundColor: 'white',
              }}
            >
              {/* Radio Button for Selection */}
              {location.pathname == '/checkout' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: '5px',
                }}
              >
                <Radio
                  checked={selectedAddress === addr._id}
                  onChange={() => handleAddressChange(addr._id)}
                  value={addr._id}
                  name="selectedAddress"
                  color="primary"
                />
              </Box>
              )}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '8px',
                  marginLeft: '25px', 
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
                  fontWeight: 'bold',
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
                  <DeleteOutlineOutlined />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No address added</Typography>
        )}
      </>

      {/* Add/Edit Address Modal */}
      <AddressModal 
      open={open} 
      handleCloseModal={handleCloseModal} 
      handleSaveAddress={handleSaveAddress}
      formData={formData}
      errors={errors}
      states={states}
      handleInputChange={handleInputChange}
      />

    {/* Delete Confirmation Dialog */}
    <AlertConfirm open={confirmationOpen} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} message={'Are you sure you want to delete this address?'}/>
    </Box>
  );
};

export default Address;
