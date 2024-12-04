import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Box, Modal, Typography, Select, MenuItem, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ManageBanner = ({ banners, bannerData, setBannerData, onAddBanner, onUpdateBanner, isUploading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const locations = ['Home', 'Products', 'Brands', 'About Us', 'Contact Us'];

  const saveBanner = async () => {
    if (bannerData.id) {
      // If editing, call the update function
      await onUpdateBanner(bannerData.id, bannerData.image);
    } else {
      // If adding, call the add function
      await onAddBanner(bannerData);
    }
    closeModal();
  };

  const openModal = (banner = {}) => {
    setBannerData({
      id: banner._id || null,
      bannerLocation: banner.bannerLocation || '',
      image: banner.image || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setBannerData({ bannerLocation: '', image: '' });
    setModalOpen(false);
  };

  const handleChange = (key, value) => setBannerData(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => handleChange('image', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const isSaveDisabled = !bannerData.bannerLocation || isUploading;

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={() => openModal()} sx={{ mb: 2 }}>
        Add New Banner
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Banner Image</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell align="center">{banner.bannerLocation}</TableCell>
                <TableCell align="center">
                  <img src={banner.image || 'https://via.placeholder.com/100'} alt="Banner" style={{ width: 100, borderRadius: 8 }} />
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined" onClick={() => openModal(banner)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: 400, maxHeight: '80vh', bgcolor: 'background.paper',
          borderRadius: 3, boxShadow: 24, p: 4, overflowY: 'auto'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {bannerData.id ? 'Edit Banner' : 'Add New Banner'}
          </Typography>

          <Select
            value={bannerData.bannerLocation}
            onChange={(e) => handleChange('bannerLocation', e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
            disabled={!!bannerData.id} // Disable editing location in edit mode
          >
            <MenuItem value="" disabled>Select Location</MenuItem>
            {locations.map((loc) => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
          </Select>

          <Box sx={{ border: '2px dashed #1976d2', borderRadius: 2, p: 2, textAlign: 'center', cursor: 'pointer' }}>
            {bannerData.image ? (
              <Box sx={{ position: 'relative' }}>
                <img src={bannerData.image} alt="Preview" style={{ width: '100%', borderRadius: 8 }} />
                <Button variant="contained" color="error" sx={{
                  position: 'absolute', top: 8, right: 8, padding: 0, minWidth: 0
                }} onClick={() => handleChange('image', '')}><CloseIcon /></Button>
              </Box>
            ) : (
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span" sx={{ width: '100%' }}>
                  Add Image
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="error" onClick={closeModal} sx={{ minWidth: 100 }}>
              Cancel
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              {isUploading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  onClick={saveBanner}
                  sx={{ minWidth: 100 }}
                  disabled={isSaveDisabled}
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageBanner;
