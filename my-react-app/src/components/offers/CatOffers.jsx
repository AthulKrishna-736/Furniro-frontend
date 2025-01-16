import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem, Select, InputLabel, FormControl, Box, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

const CatOffers = () => {
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    expiryDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, offerResponse] = await Promise.all([
          axiosInstance.get('/admin/getCat'),
          axiosInstance.get('/admin/getCatOffers')
        ]);
        console.log('offerres :', offerResponse.data)
        setCategories(categoryResponse.data.categories || []);
        setOffers(offerResponse.data.offers || []);
      } catch {
        toast.error('Error fetching data.');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateOffer = async () => {
    const { categoryId, discountType, discountValue, startDate, expiryDate } = formData;
    if (!categoryId || !discountType || !discountValue || !startDate || !expiryDate) {
      return toast.error('All fields are required!');
    }

    try {
      const response = await axiosInstance.post('/admin/createOffer', formData);
      console.log('res created offer: ',response.data)
      toast.success('Offer created successfully!');
      setOpen(false);
      const { data } = await axiosInstance.get('/admin/getCatOffers');
      setOffers(data.offers);
    } catch {
      toast.error('Error creating offer');
    }
  };

  const handleBlockOffer = async (offerId) => {
    try {
      console.log('offer id:', offerId);
      const response = await axiosInstance.patch(`/admin/blockCatOffer/${offerId}`, { isActive: false });
      console.log('respons of block:', response.data)
      toast.success('Offer blocked successfully!');
      const { data } = await axiosInstance.get('/admin/getCatOffers');
      setOffers(data.offers);
    } catch {
      toast.error('Error blocking offer');
    }
  };

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Category Offers
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create Offer
        </Button>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Discount Type</TableCell>
              <TableCell align="right">Discount Value</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Expiry Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.length ? (
              offers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell>{offer.categoryName || 'N/A'}</TableCell>
                <TableCell align="right">{offer.discountType}</TableCell>
                <TableCell align="right">{offer.discountValue}{offer.discountType === 'percentage' ? '%' : ''}</TableCell>
                <TableCell align="right">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">{new Date(offer.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">{offer.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="error" onClick={() => handleBlockOffer(offer._id)}>
                    {offer.isActive ? 'Block' : 'Unblock'}
                  </Button>
                </TableCell>
              </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
            width: '400px',
          }}
        >
          <Typography variant="h5" mb={2}>
            Create New Offer
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select name="categoryId" value={formData.categoryId} onChange={handleInputChange}>
              {categories.length ? (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No categories</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Discount Type</InputLabel>
            <Select name="discountType" value={formData.discountType} onChange={handleInputChange}>
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="flat">Flat</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Discount Value"
            type="number"
            name="discountValue"
            fullWidth
            margin="normal"
            value={formData.discountValue}
            onChange={handleInputChange}
          />
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <TextField
            label="Expiry Date"
            type="date"
            name="expiryDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.expiryDate}
            onChange={handleInputChange}
          />
          <Button fullWidth variant="contained" color="primary" onClick={handleCreateOffer}>
            Create Offer
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CatOffers;
