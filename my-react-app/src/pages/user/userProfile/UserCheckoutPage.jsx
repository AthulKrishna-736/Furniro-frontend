import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cart from '../../../components/user/userprofile/Cart';
import Navbar from '../../../components/header/Navabar';
import Address from '../../../components/user/userprofile/Address';
import axiosInstance from '../../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../../utils/toastUtils';
import { ToastContainer } from 'react-toastify';

const UserCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [cartId, setCartId] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get(`/user/getCart/${userId}`);
        setCartItems(response?.data?.cart?.items || []);
        setCartId(response?.data?.cart?._id)
        calculateTotal();
        console.log('order detal: ', orderDetails)

      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data?.message);
      }
    };

    fetchCart();
  }, [userId]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productId.salesPrice * item.quantity), 0);
  };

  const handleAddressChange = (addressId) => {
    console.log('selected address checkout: ', addressId)
    setSelectedAddress(addressId);
  };

  const handlePaymentChange = (event) => {
    console.log('pay method checkout: ', event.target.value)
    setPaymentMethod(event.target.value);
  };

  const handlePlaceOrder = async () => {
    try {
  
      const orderData = {
        userId, 
        cartId: cartId,
        selectedAddress, 
        paymentMethod, 
        totalPrice: calculateTotal(),
      };
  
      const response = await axiosInstance.post('/user/placeOrder', orderData);
      console.log('response order: ', response?.data?.order)
      showSuccessToast(response?.data?.message)
      setOrderDetails(response?.data?.order);
      setOrderSuccess(true); 
    } catch (error) {
      console.error('Error placing order:', error);
      showErrorToast(error.response?.data?.message);
    }
  };
  

  return (
    <Box>
      {/* Navbar */}
      <Navbar />
      <ToastContainer/>

      {/* Main content */}
      <Box sx={{ display: 'flex', padding: '20px', marginTop: '80px' }}>
        {/* Left side - Cart, Address, Payment */}
        <Box
          sx={{
            width: '70%',
            marginRight: '20px',
            overflowY: 'auto',
            maxHeight: '550px',
            paddingRight: '10px',
            '&::-webkit-scrollbar': {
              width: '6px', 
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#000', 
              borderRadius: '10px', 
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0', 
            },
          }}
        >
            {/* Cart */}
          <Box sx={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>
          <Typography 
                variant="h4" 
                sx={{ 
                  color: 'black', 
                  fontFamily: '"Inter", sans-serif',
                  textAlign: 'left', 
                  marginLeft:'30px',
                }}
              >
                Your Cart
              </Typography>
            {cartItems.length > 0 ? (
              <Cart cartItems={cartItems} calculateTotalPrice={calculateTotal} />
            ) : (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'black', 
                  fontWeight: 'bold', 
                  fontFamily: '"Inter", sans-serif', 
                  letterSpacing: '0.5px', 
                  textAlign: 'center', 
                }}
              >
                Oops! Cart is empty!
              </Typography>
            )}
          </Box>


          {/* Address */}
          <Box sx={{ marginBottom: '30px', marginRight:'40px' }}>
            <Typography variant="h6" gutterBottom>Select Address</Typography>
            {/* Using the Address component */}
            <Address 
              selectedAddress={selectedAddress}
              handleAddressChange={handleAddressChange} 
            />
          </Box>

          {/* Payment */}
          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" gutterBottom>Select Payment Method</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
                <FormControlLabel value="Wallet" control={<Radio />} label="Wallet" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {/* Right side - Total calculation and Place Order button */}
        <Box sx={{ width: '20%', border: '1px solid #ddd', padding: '20px', position: 'sticky', top: '80px' }}>
          <Typography variant="h4" gutterBottom>Total</Typography>
          <Typography variant="h6">Total Price: ₹{calculateTotal().toFixed(2)}</Typography>

          <Button
            onClick={handlePlaceOrder}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
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
      </Box>

      {/* Modal for success message */}
      {orderSuccess && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            width: '400px',
            borderRadius: '8px',
          }}
        >
        <Typography variant="h4" gutterBottom>Order Placed Successfully!</Typography>
        <Typography variant="h6">Order ID: {orderDetails._id}</Typography>
        <Typography variant="h6" sx={{ color: 'blue' }}>Total: ₹{orderDetails.totalPrice}</Typography>
        <Typography variant="h6">Payment Method: {orderDetails.paymentMethod}</Typography>
        <Typography variant="h6">Ordered Username: {orderDetails.address.name}</Typography>
        <Typography variant="h6">Ordered Address: {orderDetails.address.fullAddress}</Typography>
        <Typography variant="h6" sx={{ color: 'red' }}>Status: {orderDetails.status}</Typography>


        <Typography variant="h6" gutterBottom>Ordered Items:</Typography>
        {orderDetails.cartItems?.map((item, index) => (
          <Typography key={index} variant="body1">
            {item.productName} - (x{item.quantity}) - ₹{(item.price).toFixed(2)}
          </Typography>
        ))}

        <Button
          onClick={() => navigate('/')}
          sx={{
            marginTop: '20px',
            backgroundColor: 'green',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            borderRadius: '5px',
            fontSize: '16px',
          }}
        >
          Go to Homepage
        </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserCheckoutPage;
