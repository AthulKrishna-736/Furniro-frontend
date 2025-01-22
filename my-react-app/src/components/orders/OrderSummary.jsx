import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter applicable coupons
  const applicableCoupons = coupons.filter((coupon) => {
    if (coupon.discountType === "FLAT") {
      return totalPrice >= coupon.minPrice;
    } else if (coupon.discountType === "PERCENTAGE") {
      return totalPrice <= coupon.maxPrice;
    }
    return false;
  });

  // Handle coupon apply
  const applyCoupon = () => {
    const coupon = applicableCoupons.find((c) => c.name === couponCode.trim());
    if (coupon) {
      setSelectedCoupon(coupon);
      const newDiscountedPrice =
        coupon.discountType === "FLAT"
          ? Math.max(0, totalPrice - coupon.discountValue)
          : Math.max(0, totalPrice * (1 - coupon.discountValue / 100));
      setDiscountedPrice(newDiscountedPrice);
      setErrorMessage(""); // Clear error if valid
    } else {
      setErrorMessage("Coupon code is not valid."); // Show error for invalid coupon
      setSelectedCoupon(null);
      setDiscountedPrice(totalPrice); // Reset the price if coupon is invalid
    }
  };

  // Reset discounted price on coupon input change
  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
    setSelectedCoupon(null); // Reset selected coupon
    setDiscountedPrice(totalPrice); // Reset to original price
    setErrorMessage(""); // Clear any previous error message
  };

  const finalPrice = selectedCoupon ? discountedPrice : totalPrice;

  // Handle dropdown toggle
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: "25%", padding: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Order Summary
      </Typography>

      {/* Cart Items */}
      <Box sx={{ mb: 2 }}>
        {cartItems.map((item, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>
              {item.name} x {item.quantity || 1}
            </Typography>
            <Typography>₹{(item.productId.salesPrice * (item.quantity || 1)).toFixed(2)}</Typography>
          </Box>
        ))}
      </Box>

      {/* Total Price */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Total: ₹{totalPrice.toFixed(2)}
      </Typography>

      {/* Coupon Input */}
      <Box sx={{ mb: 2 }}>
        {/* Coupon Code Input */}
        <TextField
          fullWidth
          label="Enter Coupon Code"
          value={couponCode}
          onChange={handleCouponInputChange} // Reset discount on input change
          variant="outlined"
          error={!!errorMessage}
          helperText={errorMessage}
          sx={{ mb: 1 }}
        />

        {/* Apply Coupon Button */}
        <Button
          onClick={applyCoupon}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "8px",
            fontSize: "14px",
            textTransform: "capitalize",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#333" },
            width: "100%",
            mb: 1,
          }}
        >
          Apply Coupon
        </Button>

        {/* View Available Coupons Button */}
        <Button
          onClick={handleOpenMenu}
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#000",
            padding: "8px",
            fontSize: "14px",
            textTransform: "capitalize",
            border: "1px solid #ddd",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#e0e0e0" },
            width: "100%",
          }}
        >
          View Available Coupons
        </Button>

        {/* Available Coupons Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {applicableCoupons.map((coupon) => (
            <MenuItem key={coupon._id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {coupon.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "green", marginLeft: "16px" }}>
                  {coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} FLAT`}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "gray" }}>
                Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}
              </Typography>
            </Box>

                <IconButton
                  onClick={() => navigator.clipboard.writeText(coupon.name)}
                  edge="end"
                  title="Copy Coupon Code"
                  sx={{
                    color: "#000",
                    "&:hover": { color: "#555" },
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Discount Value */}
      {selectedCoupon && (
        <Typography sx={{ mb: 2, color: "green" }}>
          Discount: ₹{(totalPrice - discountedPrice).toFixed(2)}
        </Typography>
      )}

      {/* Final Price */}
      <Typography variant="h6">Final Price: ₹{finalPrice.toFixed(2)}</Typography>

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
