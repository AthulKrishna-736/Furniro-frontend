import React from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const OrderSummary = ({
  cartItems,
  selectedCoupon,
  setSelectedCoupon,
  totalPrice,
  handlePlaceOrder,
  coupons,
  setDiscountedPrice,
  discountedPrice,
}) => {
  // Filter applicable coupons based on total price
  const applicableCoupons = coupons.filter((coupon) => totalPrice >= coupon.minPrice);

  // Handle coupon selection
  const handleCouponSelect = (event) => {
    const coupon = applicableCoupons.find((c) => c._id === event.target.value);
    setSelectedCoupon(coupon || null);

    const newDiscountedPrice = coupon
      ? coupon.discountType === "FLAT"
        ? Math.max(0, totalPrice - coupon.discountValue)
        : Math.max(0, totalPrice * (1 - coupon.discountValue / 100))
      : totalPrice;

    setDiscountedPrice(newDiscountedPrice);
  };

  // Final price after applying discount
  const finalPrice = selectedCoupon ? discountedPrice : totalPrice;

  return (
    <Box sx={{ width: "25%", padding: 2, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#fff", display: "flex", flexDirection: "column", height: "auto", maxHeight: "100vh", overflowY: "auto" }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ color: "primary.main", textDecoration: "underline", textDecorationColor: "primary.main", textDecorationThickness: 2, textUnderlineOffset: 10 }}>
        Order Summary
      </Typography>

      {/* Cart Items */}
      <Box sx={{ mb: 2 }}>
        {cartItems.map((item, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">{item.name} x {item.quantity || 1}</Typography>
            <Typography variant="body2">₹{(item.productId.salesPrice * (item.quantity || 1)).toFixed(2)}</Typography>
          </Box>
        ))}
      </Box>

      {/* Total Price */}
      <Typography variant="body2" sx={{ mb: 2, fontSize: "20px" }}>Total: ₹{totalPrice.toFixed(2)}</Typography>

      {/* Coupons Dropdown */}
      {applicableCoupons.length > 0 && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Coupons</InputLabel>
          <Select
            value={selectedCoupon?._id || ""}
            onChange={handleCouponSelect}
            sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
          >
            <MenuItem value="">None</MenuItem>
            {applicableCoupons.map((coupon) => (
              <MenuItem key={coupon._id} value={coupon._id} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                {coupon.name} - {coupon.discountType === "FLAT" ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Discounted Price */}
      {selectedCoupon && (
        <Typography variant="body2" sx={{ mb: 2, fontSize: "18px", color: "green" }}>
          Discount Value: ₹{(totalPrice - discountedPrice).toFixed(2)}
        </Typography>
      )}

      {/* Final Price */}
      <Typography variant="body1" sx={{ fontSize: "20px", mt: "auto" }}>
        Final Price: ₹{finalPrice.toFixed(2)}
      </Typography>

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          width: "100%",
          padding: "8px",
          fontSize: "14px",
          mt: 1,
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderSummary;
