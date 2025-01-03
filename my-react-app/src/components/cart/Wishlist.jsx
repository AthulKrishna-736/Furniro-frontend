import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { DeleteOutline, ShoppingCartCheckout } from '@mui/icons-material';
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const userId = localStorage.getItem('userId');

  const fetchWishlist = async () => {
    try {
      const response = await axiosInstance.get(`/user/getWishlist/${userId}`);
      setWishlistItems(response?.data?.wishlist || []);
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axiosInstance.post('/user/deleteWishlist', {
        userId,
        productId,
      });
      showSuccessToast(response?.data?.message);
      setWishlistItems((prev) => prev.filter((item) => item.productId._id !== productId));
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleAddToCartSingle = async(productId) => {
    try {
      const item = {
        userId,
        productId: productId,
        quantity: 1,
      }
      const response = await axiosInstance.post('/user/moveToCart', item)
      showSuccessToast(response.data?.message);
    } catch (error) {
      showErrorToast(error.response.data?.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      {wishlistItems.length === 0 ? (
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
            fontSize: '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
            marginBottom: '20px',
          }}
        >
          Oops, your wishlist is empty!
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            overflowY: 'auto',
            maxHeight: '50vh',
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
          {wishlistItems.map((item) => (
            <Box
              key={item.productId._id}
              sx={{
                display: 'flex',
                marginBottom: '20px',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
                position: 'relative',
              }}
            >
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  marginRight: '20px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                }}
              />
              <Box sx={{ flex: 1, padding: '10px' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}
                  >
                    {item.productId.name}
                  </Typography>
                  <Box>
                    <IconButton
                      sx={{
                        color: '#d32f2f',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => handleDelete(item.productId._id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: '#007bff',
                        backgroundColor: 'transparent',
                        marginLeft: '5px',
                      }}
                      onClick={() => handleAddToCartSingle(item.productId._id)}
                    >
                      <ShoppingCartCheckout />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: '#007bff', fontWeight: '500', marginBottom: '5px' }}
                >
                  ₹{item.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Added on:{' '}
                  {new Date(item.addedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Wishlist;
