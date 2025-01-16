import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from '@mui/material';

const CouponForm = ({
  open,
  handleModalClose,
  handleCreateCoupon,
  newCoupon,
  errors,
  handleInputChange,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleModalClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="create-coupon-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Create Coupon
        </Typography>
        <form onSubmit={handleCreateCoupon} style={{ display: 'grid', gap: '20px' }}>
          <TextField
            label="Coupon Name"
            name="name"
            value={newCoupon.name}
            helperText={errors.name}
            error={Boolean(errors.name)}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="discountType"
              value={newCoupon.discountType}
              onChange={handleInputChange}
            >
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              <MenuItem value="FLAT">Flat</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Discount Value"
            name="discountValue"
            type="number"
            value={newCoupon.discountValue}
            error={Boolean(errors.discountValue)}
            helperText={errors.discountValue}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Minimum Price"
            name="minPrice"
            type="number"
            value={newCoupon.minPrice}
            error={Boolean(errors.minPrice)}
            helperText={errors.minPrice}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={newCoupon.expiryDate}
            error={Boolean(errors.expiryDate)}
            helperText={errors.expiryDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Count"
            name="count"
            type="number"
            value={newCoupon.count}
            error={Boolean(errors.count)}
            helperText={errors.count}
            onChange={handleInputChange}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleModalClose} color="black" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create Coupon
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CouponForm;
