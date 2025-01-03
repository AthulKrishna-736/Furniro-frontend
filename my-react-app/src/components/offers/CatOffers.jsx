import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const 
CatOffers = () => {
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
      await axios.post('/api/offers', formData);
      toast.success('Offer created successfully!');
      setOpen(false);
      const { data } = await axios.get('/admin/getCatOffers');
      setOffers(data.offers);
    } catch {
      toast.error('Error creating offer');
    }
  };

  const handleBlockOffer = async (offerId) => {
    try {
      await axiosInstance.patch(`/admin/offers/${offerId}`, { isActive: false });  // Assuming 'isActive' is the field to block
      toast.success('Offer blocked successfully!');
      const { data } = await axios.get('/admin/getCatOffers');
      setOffers(data.offers);
    } catch {
      toast.error('Error blocking offer');
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>Create Offer</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Discount Type</TableCell>
              <TableCell align="right">Discount Value</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Expiry Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.length ? offers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell>{offer.categoryId?.name || 'N/A'}</TableCell>
                <TableCell align="right">{offer.discountType}</TableCell>
                <TableCell align="right">{offer.discountValue}{offer.discountType === 'percentage' ? '%' : ''}</TableCell>
                <TableCell align="right">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">{new Date(offer.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="error" onClick={() => handleBlockOffer(offer._id)}>Block</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6} align="center">No offers available</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', width: '400px', margin: '100px auto', height: '400px', overflowY:'auto' }}>
          <h2>Create New Offer</h2>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select name="categoryId" value={formData.categoryId} onChange={handleInputChange}>
              {categories.length ? categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              )) : <MenuItem value="">No categories</MenuItem>}
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

          <Button variant="contained" onClick={handleCreateOffer}>Create Offer</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CatOffers;
