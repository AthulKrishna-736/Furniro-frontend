import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../utils/toastUtils';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [loadingState, setLoadingState] = useState({});

  const userId = localStorage.getItem('userId');
  
  const fetchCart = async () => {
    try {
        const response = await axiosInstance.get(`/user/getCart/${userId}`);
        setCartItems(response?.data?.cart?.items || []);
        console.log('cart res : ', response.data)
    } catch (error) {
        console.error('error fetching cart items: ', error);
    }
    }

    useEffect(()=>{
        fetchCart();
    },[])


  const handleRemoveItem = async(id) => {
    try {
        console.log('response going to remove the');
        const response = await axiosInstance.delete(`/user/deleteItem/${id}`);
        showSuccessToast(response?.data?.message);
        console.log(`Item with ID: ${id} removed successfully`);
    
        fetchCart();
      } catch (error) {
        console.error(`Failed to remove item with ID: ${id}`, error);
      }
  };

  const handleQuantityChange = async (id, action) => {
    setLoadingState((prev)=> ({ ...prev, [id]: true }));
    try {
      const response = await axiosInstance.patch(`/user/updateQuantity/${userId}`, {
        itemId: id, 
        action: action, 
      });
    
      fetchCart();
    } catch (error) {
      showErrorToast(error.response?.data?.message)
    } finally {
      setLoadingState((prev)=> ({ ...prev, [id]: false}));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productId.salesPrice * item.quantity), 0);
  };


  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.get(`/user/getCart/${userId}`)
      console.log('response block check: ', response.data)
  
      if (response.data.blockedItems && response.data.blockedItems.length > 0) {
        const blockedItemNames = response.data.blockedItems.map(item => item.name).join(', ');
        showInfoToast(`Blocked items in your cart: ${blockedItemNames}. Please remove them to proceed.`,);
        return; 
      }
  
      navigate('/checkout');
    } catch (error) {
      console.error('Error fetching cart or handling checkout:', error);
      showErrorToast('An error occurred while checking the cart. Please try again.');
    }
  };
  

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      {/* Product Listing Section (Left side - 70%) */}
      <Box
        sx={{
          width: '70%',
          marginRight: '20px',
          overflowY: 'auto',
          maxHeight: '350px',
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
      {cartItems.length === 0 ? (
        <Box
          sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#fff',  
              borderRadius: '5px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              color: '#333',  
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Arial, Helvetica, sans-serif', 
              border: '1px solid #ddd',
              marginBottom: '20px',
              textAlign: 'center',
          }}
      >
          Oops, your cart is empty!
      </Box>

        ) : (
        cartItems.map((item) => (
            <Box
                key={item._id}
                sx={{
                    display: 'flex',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <img
                    src={item.productId.images[0]} 
                    alt={item.productId.name}
                    style={{
                        width: '100px',
                        height: '100px',
                      objectFit: 'cover',
                      marginRight: '20px',
                    }}
                />
              <Box sx={{ flex: 1, padding: '10px' }}>
                {/* Parent Box */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ gap: '8px' }}
                >
                  {/* Product Name */}
                  <Box sx={{ flex: 2, textAlign:'start' }}>
                    <Typography variant="h6">{item.productId.name}</Typography>
                  </Box>

                  {/* Quantity Control Buttons */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ flex: 1 }}
                  >
                    <Button
                      onClick={() => handleQuantityChange(item._id, 'decrease')}
                      disabled={loadingState[item._id]}
                      sx={{
                        width: '40px',
                        height: '40px',
                        border: '1px solid #ddd',
                        backgroundColor: '#fff',
                        fontSize: '20px',
                      }}
                    >
                      -
                    </Button>
                    <Typography sx={{ margin: '0 15px', fontSize: '22px' }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      onClick={() => handleQuantityChange(item._id, 'increase')}
                      disabled={loadingState[item._id]}
                      sx={{
                        width: '40px',
                        height: '40px',
                        border: '1px solid #ddd',
                        backgroundColor: '#fff',
                        fontSize: '20px',
                      }}
                    >
                      +
                    </Button>
                  </Box>

                  {/* Total Price */}
                  <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography variant="h6">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Sales Price */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '20px',
                    textDecoration: 'line-through',
                    textAlign:'start',
                    color: '#777',
                  }}
                >
                  ₹{item.productId.salesPrice}
                </Typography>
              </Box>

            <Button
              onClick={() => handleRemoveItem(item._id)} 
              sx={{
                color: '#EF5350',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                minWidth: '0',
                padding: '0',
              }}
            >
          <DeleteIcon />
          </Button>
      </Box>
         ))
      )}
    </Box>

      {/* Cart Summary Section (Right side - 30%) */}
      {location.pathname === '/cart' && (
        <Box sx={{ 
          width: '30%', 
          border: '1px solid #ddd', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-end',  
          height: '230px' 
        }}>
          <Typography variant="h4" gutterBottom>
            Cart Total
          </Typography>

          <Box sx={{ marginTop: 'auto' }}>
            <Typography variant="h6">
              Total Price: ₹{calculateTotal().toFixed(2)}
            </Typography>
            <Button
              onClick={handleCheckout}
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
                marginTop: '10px',
              }}
            >
              Go to Checkout
            </Button>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default Cart;
