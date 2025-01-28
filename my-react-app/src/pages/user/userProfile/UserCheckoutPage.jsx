import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../../../components/header/Navabar';
import Address from '../../../components/address/Address';
import axiosInstance from '../../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../../utils/toastUtils';
import { ToastContainer } from 'react-toastify';
import PaymentComponent from '../../../components/payment/Payment';
import OrderSummary from '../../../components/orders/OrderSummary';
import PaymentMethod from '../../../components/payment/PaymentMethod';
import OrderSuccess from '../../../components/orders/orderSuccess';

const UserCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cartId, setCartId] = useState('');
  const [orderDetails, setOrderDetails] = useState({});
  const [orderId, setOrderId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [razorpay, setRazorpayOpen] = useState(false);
  const [coupons, setCoupons] = useState([])
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/user/getCart/${userId}`);
      const items = response?.data?.cart?.items || [];
      setCartItems(items);
      setCartId(response.data?.cart?._id);
      setTotalPrice(response.data?.cart?.totalPrice)

    } catch (error) {
      console.error('Error fetching cart items:', error.response?.data?.message);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get(`/user/getCoupons`);
      setCoupons(response.data.coupons);
    } catch (error) {
      console.log('error while getting coupons: ', error)
    }
  }

  useEffect(() => {
    fetchCart();
    fetchCoupons()
  }, [userId]);

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCloseModal = () => {
    setOrderSuccess(false);
  }

  const handlePlaceOrder = async () => {
    const orderData = {
      userId,
      cartId,
      selectedAddress,
      paymentMethod,
      totalPrice,
      discountedPrice,
      selectedCoupon: selectedCoupon?._id,
      paymentStatus: paymentMethod === 'Wallet' ? 'Completed' : 'Pending',
    };
  
    await proceedWithOrder(orderData);
  };
  
  const proceedWithOrder = async (orderData) => {
    try {
      const orderResponse = await axiosInstance.post('/user/placeOrder', orderData);
      setOrderDetails(orderResponse.data.order);
      setOrderId(orderResponse.data.order._id);
      showSuccessToast(orderResponse.data.message);
      await fetchCart();
      setSelectedAddress('');
      setPaymentMethod('');
      setOrderSuccess(true);
  
      if (orderData.paymentMethod === 'Razorpay') {
        setRazorpayOpen(true);
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar />
      <ToastContainer />

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
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#aaa',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#888',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          {/* Cart */}
          <Box
            sx={{
              marginBottom: '30px',
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'black',
                fontFamily: '"Inter", sans-serif',
                textAlign: 'left',
                marginLeft: '30px',
                marginBottom: '20px',
              }}
            >
              Your Cart
            </Typography>
            {cartItems.length > 0 ? (
              <Box>
                {cartItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '15px',
                      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: '100px',
                        height: '100px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        marginRight: '20px',
                      }}
                    >
                      <img
                        src={item.productId.images?.[0]}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'bold',
                          fontFamily: '"Inter", sans-serif',
                          marginBottom: '5px',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          color: '#555',
                          marginBottom: '5px',
                        }}
                      >
                        Price: ₹{item.productId.salesPrice}
                      </Typography>
                    </Box>

                    {/* Quantity and Actions */}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Inter", sans-serif',
                        marginLeft: '20px',
                      }}
                    >
                      Qty: {item.quantity || 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
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
          <Box sx={{ marginBottom: '30px', marginRight: '40px' }}>
            <Typography variant="h6" gutterBottom>
              Select Address
            </Typography>
            <Address selectedAddress={selectedAddress} handleAddressChange={handleAddressChange} />
          </Box>

          {/* Payment */}
          <PaymentMethod
            paymentMethod={paymentMethod}
            handlePaymentChange={handlePaymentChange}
          />
        </Box>

        {/* Right side - OrderSummary */}
        <OrderSummary
          cartItems={cartItems}
          totalPrice={totalPrice}
          handlePlaceOrder={handlePlaceOrder}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          discountedPrice={discountedPrice}
          setDiscountedPrice={setDiscountedPrice}
        />
      </Box>

      {/* Razorpay payment modal */}
      {razorpay && (
        <PaymentComponent
          userId={userId}
          amount={discountedPrice === 0 ? totalPrice : discountedPrice} 
          orderId={orderId}
          setRazorpayOpen={setRazorpayOpen}
        />
      )}


      {/* Modal for success message */}
      {orderSuccess && (
        <OrderSuccess
          open={orderSuccess}
          onClose={handleCloseModal}
          orderDetails={orderDetails}
        />
      )}
    </Box>
  );
};

export default UserCheckoutPage;
