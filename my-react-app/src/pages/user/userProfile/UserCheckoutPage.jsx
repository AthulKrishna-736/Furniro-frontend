import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/header/Navabar';
import Address from '../../../components/address/Address';
import axiosInstance from '../../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../../utils/toastUtils';
import { ToastContainer } from 'react-toastify';
import PaymentComponent from '../../../components/payment/Payment';
import OrderSummary from '../../../components/orders/OrderSummary';
import { useDispatch, useSelector } from 'react-redux';
import PaymentMethod from '../../../components/payment/PaymentMethod';
import OrderSuccess from '../../../components/orders/orderSuccess';

const UserCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cartId, setCartId] = useState('');
  const [tempOrderId, setTempOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [razorpay, setRazorpayOpen] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const walletBalance = useSelector((state)=> state.userWallet.balance);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/user/getCart/${userId}`);
      console.log('checkout res: ', response.data);
      const items = response?.data?.cart?.items || [];
      setCartItems(items);
      setCartId(response.data?.cart?._id);
      setTotalPrice(response.data?.cart?.totalPrice)

    } catch (error) {
      console.error('Error fetching cart items:', error.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleAddressChange = (addressId) => {
    console.log('address in function: ', addressId)
    setSelectedAddress(addressId);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCloseModal = () =>{
    setOrderSuccess(false);
  }

  const placeOrder = async () => {
    try {
      const orderData = {
        userId,
        cartId,
        selectedAddress,
        paymentMethod,
        totalPrice,
      };
  
      const orderResponse = await axiosInstance.post('/user/placeOrder', orderData);
      setOrderDetails(orderResponse.data.order);
  
      showSuccessToast(orderResponse.data.message);
      await fetchCart();
      setSelectedAddress('');
      setPaymentMethod('');
      setOrderSuccess(true);
    } catch (error) {
      console.error('Error Placing Order: ', error);
      showErrorToast(error.response?.data?.message || 'Order placement failed');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        showErrorToast('Please select an address');
        return;
      }
      if (!paymentMethod) {
        showErrorToast('Please select a payment method');
        return;
      }
  
      if (paymentMethod === 'Wallet') {
        if (totalPrice > walletBalance) {
          showErrorToast('Insufficient wallet balance');
          return;
        }
      }
  
      const tempOrderData = {
        userId,
        cartItems: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        selectedAddress,
        totalPrice,
        paymentMethod,
      };
  
      const tempOrderResponse = await axiosInstance.post('/user/tempOrder', tempOrderData);
      setTempOrderId(tempOrderResponse?.data?.tempOrder?._id)
      console.log('ordertotalprice here properly: ',[totalPrice, tempOrderResponse?.data])
      if (paymentMethod === 'Razorpay' && tempOrderResponse?.data?.tempOrder?._id) {
        console.log('total price before placing order: ', totalPrice)
        setRazorpayOpen(true);
        return; 
      }

      await placeOrder()
    } catch (error) {
      console.error('Error placing order:', error);
      showErrorToast(error.response?.data?.message || 'Order placement failed');
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
           walletBalance={walletBalance}
           handlePaymentChange={handlePaymentChange}          
          />
        </Box>

        {/* Right side - OrderSummary */}
        <OrderSummary totalPrice={totalPrice} handlePlaceOrder={handlePlaceOrder} />
      </Box>

      {/* Razorpay payment modal */}
      {razorpay && (
        <PaymentComponent
          orderId={tempOrderId}
          amount={totalPrice}
          setRazorpayOpen={setRazorpayOpen}
          placeOrder={placeOrder}
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
