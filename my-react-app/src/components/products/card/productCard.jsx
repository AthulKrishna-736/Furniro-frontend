import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { AddShoppingCart, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../../utils/toastUtils';

const ProductCard = ({ product = {}, variant = "default" }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    try {
      const response = await axiosInstance.post('/user/cart', { userId, productId: product._id, quantity: 1 });
      showSuccessToast(response.data?.message);
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  const handleAddToWishlist = async (event) => {
    event.stopPropagation();
    try {
      const response = await axiosInstance.post('/user/addWishlist', { userId, productId: product._id });
      showSuccessToast('Added to wishlist');
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  const handleCardClick = () => {
    console.log('Product here:', product);
    if (product._id) {
      navigate(`/product-detail/${product._id}`);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 315,
        border: '1px solid #ddd',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': variant === "trending" ? {
          transform: 'scale(1.05)',
          boxShadow: '0 0 8px rgba(0, 123, 255, 0.5)',
        } : {
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <Box
        sx={{
          borderBottom: '1px solid #ddd',
          height: 195,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          alt={product.name || 'Product'}
          image={product.images?.[0] || '/path/to/default-image.jpg'}
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* Product Details */}
      <CardContent
        sx={{
          padding: 2,
          borderBottom: '1px solid #ddd',
          height: 120,
          overflow: 'hidden',
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 1,
          }}
        >
          {product.name || 'No Name Available'}
        </Typography>

        {/* Product Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            marginBottom: 2,
          }}
        >
          {product.description && product.description.length > 100
            ? `${product.description.slice(0, 30)}...`
            : product.description || "No description available."}
        </Typography>
      </CardContent>

      {/* Price and Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          borderTop: '1px solid #ddd',
        }}
      >
        {/* Price */}
        <Box>
          {product.discountPrice ? (
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 'bold',
                display: 'inline',
              }}
            >
              ₹{product.discountPrice}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: 'inline',
                  textDecoration: 'line-through',
                  marginLeft: 1,
                }}
              >
                ₹{product.salesPrice}
              </Typography>
            </Typography>
          ) : (
            // Original Price for non-discounted products
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 'bold',
              }}
            >
              ₹{product.salesPrice}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box>
          <Tooltip title="Add to Cart">
            <IconButton onClick={handleAddToCart} color="primary" sx={{ marginRight: 1 }}>
              <AddShoppingCart />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add to Wishlist">
            <IconButton onClick={handleAddToWishlist} color="error">
              <Favorite />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

    </Card>
  );
};

export default ProductCard;
