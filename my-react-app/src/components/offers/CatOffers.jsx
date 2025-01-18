import React, { useEffect, useState } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Modal, TextField, MenuItem, Select, InputLabel, FormControl, Box, Typography,
  Paper, IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import AlertConfirm from '../customAlert/AlertConfirm';

const CatOffers = () => {
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    expiryDate: '',
  });

  const fetchData = async () => {
    try {
      const [categoryResponse, offerResponse] = await Promise.all([
        axiosInstance.get('/admin/getCat'),
        axiosInstance.get('/admin/getCatOffers'),
      ]);
      console.log('offers res = ', offerResponse.data.offers)
      setCategories(categoryResponse.data.categories || []);
      setOffers(offerResponse.data.offers || []);
    } catch (error) {
      showErrorToast('Error fetching data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateOffer = async () => {
    const { categoryId, discountType, discountValue, startDate, expiryDate } = formData;

    if (!categoryId || !discountType || !discountValue || !startDate || !expiryDate) {
      return showErrorToast('All fields are required!');
    }

    try {
      await axiosInstance.post('/admin/createOffer', formData);
      showSuccessToast('Offer created successfully!');
      setOpen(false);
      fetchData();
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      if (selectedOffer) {
        const response = await axiosInstance.delete(`/admin/deleteCatOffer/${selectedOffer}`);
        showSuccessToast(response.data.message);
        setAlertOpen(false);
        fetchData();
      }
    } catch (error) {
      setAlertOpen(false);
      showErrorToast('Error deleting offer.');
    }
  };

  const handleBlockOffer = async () => {
    try {
      if (selectedOffer) {
        const response = await axiosInstance.patch(`/admin/blockCatOffer/${selectedOffer}`);
        console.log('block check ', response.data)
        showSuccessToast(response.data.message);
        setBlockOpen(false);
        fetchData();
      }
    } catch (error) {
      showErrorToast('Error blocking/unblocking offer.');
      setAlertOpen(false)
    }
  };

  return (
    <Box p={3} bgcolor="#f9f9f9" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Category Offers
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create Offer
        </Button>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              {['Category', 'Discount Type', 'Discount Value', 'Start Date', 'Expiry Date', 'Status', 'Actions'].map((header) => (
                <TableCell key={header} sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.length ? (
              offers.map(({ categoryName, discountType, discountValue, startDate, expiryDate, isActive, offerId }) => (
                <TableRow key={offerId} sx={{ '&:hover': { backgroundColor: '#e0f7fa' } }}>
                  <TableCell align="center">{categoryName || 'N/A'}</TableCell>
                  <TableCell align="center">{discountType}</TableCell>
                  <TableCell align="center">{`${discountValue}${discountType === 'percentage' ? '%' : ''}`}</TableCell>
                  <TableCell align="center">{new Date(startDate).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{new Date(expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color={isActive ? 'error' : 'success'}
                      onClick={() => {
                        setSelectedOffer(offerId);
                        setBlockOpen(true);
                      }}
                    >
                      {isActive ? 'Block' : 'Unblock'}
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedOffer(offerId);
                        setAlertOpen(true);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No offers available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: { xs: '90%', sm: '400px' },
          }}
        >
          <Typography variant="h5" mb={2}>Create New Offer</Typography>
          {[{ label: 'Category', name: 'categoryId', type: 'select', options: categories },
            { label: 'Discount Type', name: 'discountType', type: 'select', options: [{ id: 'percentage', name: 'Percentage' }, { id: 'flat', name: 'Flat' }] },
            { label: 'Discount Value', name: 'discountValue', type: 'number' },
            { label: 'Start Date', name: 'startDate', type: 'date' },
            { label: 'Expiry Date', name: 'expiryDate', type: 'date' }].map(({ label, name, type, options }) => (
              type === 'select' ? (
                <FormControl fullWidth margin="normal" key={name}>
                  <InputLabel>{label}</InputLabel>
                  <Select name={name} value={formData[name]} onChange={handleInputChange}>
                    {options.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={name}
                  label={label}
                  type={type}
                  name={name}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData[name]}
                  onChange={handleInputChange}
                />
              )
            ))}
          <Button fullWidth variant="contained" color="primary" onClick={handleCreateOffer}>
            Create Offer
          </Button>
        </Box>
      </Modal>

      <AlertConfirm
        open={blockOpen}
        message="Are you sure you want to block/unblock this offer?"
        onConfirm={handleBlockOffer}
        onCancel={() => setBlockOpen(false)}
      />
      <AlertConfirm
        open={alertOpen}
        message="Are you sure you want to delete this offer?"
        onConfirm={handleDeleteOffer}
        onCancel={() => setAlertOpen(false)}
      />
    </Box>
  );
};

export default CatOffers;
