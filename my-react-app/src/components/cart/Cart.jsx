import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showInfoToast, showSuccessToast, showWarningToast } from '../../utils/toastUtils';
import { DeleteOutline } from '@mui/icons-material';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingState, setLoadingState] = useState({});

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get(`/user/getCart/${userId}`);
      setCartItems(data.cart?.items || []);
      setCartTotal(data.cart?.totalPrice || 0);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleRemoveItem = async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/deleteItem/${id}`);
      showSuccessToast(response.data.message);
      fetchCart();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to remove item');
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = async (id, action) => {
    try {
      setLoadingState((prev) => ({ ...prev, [id]: true }));
      const response = await axiosInstance.patch(`/user/updateQuantity/${userId}`, {
        itemId: id,
        action,
      });
      showSuccessToast(response.data.message);
      fetchCart();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCheckout = async () => {
    try {
      const { data } = await axiosInstance.get(`/user/getCart/${userId}`);
      if (data.categoryBlockedItems?.length) {
        showWarningToast(`Currently unavailable in your cart: ${data.categoryBlockedItems.map((item) => item.name).join(', ')}`)
        return;
      }
      if (data.blockedItems?.length) {
        showWarningToast(`Currently unavailable in your cart: ${data.blockedItems.map((item) => item.name).join(', ')}`);
        return;
      }
      if (data.stockIssues?.length) {
        showInfoToast(
          `Stock issues detected: ${data.stockIssues.map((issue) => `${issue.name} (only ${issue.availableStock} available)`).join(', ')}. Please update quantities to proceed.`
        );
        return;
      }
      navigate('/checkout');
    } catch (error) {
      showErrorToast(error.response.data.message || 'Error during checkout. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
        <Grid item xs={12} lg={8}>
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: { xs: 'auto', lg: '60vh' },
              pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#000', borderRadius: '10px' },
              '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' },
            }}
          >
            {cartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: '30px' }}>
                <img
                  src="https://img.freepik.com/free-vector/supermarket-shopping-cart-concept-illustration_114360-22408.jpg?t=st=1738159794~exp=1738163394~hmac=02cc40e4cc7ccc6eb1eb06837f8fece2ab8257b5b6303f4cef6bdcc1f04a3184&w=740" 
                  alt="Empty Cart"
                  style={{ width: '300px', height: '300px', marginBottom: '20px' }}
                />
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontWeight: 400,
                    fontSize: '30px'
                  }}
                >
                  Oops, your cart is empty!
                </Typography>
              </Box>
            ) : (
              cartItems.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mb: 2,
                    border: '1px solid #ddd',
                    p: 2,
                    borderRadius: '8px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f0f7fd', // Light warm tone
                  }}
                >
                  {/* Product Image */}
                  <Box
                    component="img"
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    sx={{
                      height: { xs: '120px', sm: '150px' }, // Responsive height
                      width: { xs: '100%', sm: 'auto' }, // Full width on small screens
                      objectFit: 'cover',
                      borderRadius: '8px',
                      mb: { xs: 1, sm: 0 },
                      mr: { xs: 0, sm: 2 },
                    }}
                  />

                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    {/* Product Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        textAlign: { xs: 'center', sm: 'left' }, // Centered on smaller screens
                        mb: 1,
                      }}
                    >
                      {item.productId.name}
                    </Typography>

                    {/* Quantity Controls and Price Info */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 1, sm: 2 },
                        mt: 1,
                      }}
                    >
                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'center', sm: 'flex-start' }, // Centered on small screens
                          gap: 1,
                        }}
                      >
                        <Button
                          onClick={() => handleQuantityChange(item._id, 'decrease')}
                          disabled={loadingState[item._id]}
                          sx={{
                            width: 40,
                            height: 40,
                            border: '1px solid #ddd',
                            color: '#000',
                            fontWeight: 'bold',
                          }}
                        >
                          -
                        </Button>
                        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>{item.quantity}</Typography>
                        <Button
                          onClick={() => handleQuantityChange(item._id, 'increase')}
                          disabled={loadingState[item._id]}
                          sx={{
                            width: 40,
                            height: 40,
                            border: '1px solid #ddd',
                            color: '#000',
                            fontWeight: 'bold',
                          }}
                        >
                          +
                        </Button>
                      </Box>

                      {/* Price Info */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'center', sm: 'flex-end' }, // Centered on smaller screens
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: '#555',
                          }}
                        >
                          Price: ₹{item.price.toFixed(2)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 20,
                            fontWeight: 600,
                            mt: { xs: 0.5, sm: 0 }, // Space adjustment for small screens
                          }}
                        >
                          Total: ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Remove Button */}
                      <Button
                        onClick={() => handleRemoveItem(item._id)}
                        sx={{
                          color: '#EF5350',
                          mt: { xs: 1, sm: 0 }, // Spacing adjustment for small screens
                        }}
                      >
                        <DeleteOutline />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Grid>

        {location.pathname === '/cart' && (
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                border: '1px solid #ddd',
                p: 3,
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Cart Summary
              </Typography>

              {/* Product Details */}
              <Box sx={{ mt: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#333',
                        maxWidth: '60%',
                        wordWrap: 'break-word',
                      }}
                    >
                      {item.productId.name} - {item.price} x {item.quantity}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#555',
                      }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Total Price */}
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                Total Price: ₹{cartTotal}
              </Typography>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  p: 2,
                  mt: 2,
                  width: '100%',
                  borderRadius: 1,
                  fontSize: 16,
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                Go to Checkout
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Cart;