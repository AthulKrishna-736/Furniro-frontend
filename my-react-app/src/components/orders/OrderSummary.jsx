import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const OrderSummary = ({ selectedCoupon, setSelectedCoupon, totalPrice, handlePlaceOrder, coupons, setDiscountedPrice, discountedPrice }) => {

  // Filter coupons based on total price
  const applicableCoupons = coupons.filter(coupon => totalPrice >= coupon.minPrice);

  // Calculate the final price after applying the selected coupon


  const handleCouponSelect = (event) => {
    const couponId = event.target.value;
    const coupon = applicableCoupons.find(c => c._id === couponId);
    setSelectedCoupon(coupon || null);

    const newDiscountedPrice = coupon
      ? coupon.discountType === 'FLAT'
        ? Math.max(0, totalPrice - coupon.discountValue)
        : Math.max(0, totalPrice * (1 - coupon.discountValue / 100))
      : totalPrice;

    setDiscountedPrice(newDiscountedPrice);
  };

  return (
    <Box
      sx={{
        width: '20%',
        border: '1px solid #ddd',
        padding: '20px',
        position: 'sticky',
        top: '80px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Order Summary
      </Typography>

      <Typography variant="h6">
        Total Price: ₹{totalPrice.toFixed(2)}
      </Typography>

      {applicableCoupons.length > 0 && (
        <FormControl fullWidth sx={{ marginTop: '20px' }}>
          <InputLabel id="coupon-select-label">Available Coupons</InputLabel>
          <Select
            labelId="coupon-select-label"
            value={selectedCoupon?._id || ''}
            onChange={handleCouponSelect}
          >
            <MenuItem value="">
              None
            </MenuItem>
            {applicableCoupons.map((coupon) => (
              <MenuItem key={coupon._id} value={coupon._id}>
                {coupon.name} -{' '}
                {coupon.discountType === 'FLAT'
                  ? `Flat ₹${coupon.discountValue}`
                  : `${coupon.discountValue}% off`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedCoupon && (
        <Typography variant="h6" sx={{ marginTop: '10px', color: 'green' }}>
          Discounted Price: ₹{discountedPrice.toFixed(2)}
        </Typography>
      )}

      <Button
        onClick={() => handlePlaceOrder()}
        sx={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px 20px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '5px',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderSummary;
