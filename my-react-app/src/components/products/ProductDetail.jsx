import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProductCard from './card/productCard';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user/productDetails/${productId}`);
        const { product, recommendedProducts } = response.data;
        setProduct(product);
        setRecommendedProducts(recommendedProducts);
        setMainImage(product.images[0]);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      backgroundPosition: 'center',
      backgroundSize: 'contain',
    });
  };

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post('/user/cart', { userId, productId, quantity: 1 });
      showSuccessToast(response.data?.message);
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await axiosInstance.post('/user/addWishlist', { userId, productId });
      showSuccessToast(response?.data?.message);
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', marginTop: '70px' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ marginBottom: '20px' }}>
        <Link underline="hover" color="inherit" href="/home">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Main Product Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: '40px',
          alignItems: { xs: 'flex-start', md: 'center' },
          marginBottom: '40px',
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Box
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{
              width: '300px',
              height: '300px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundImage: `url(${mainImage})`,
              backgroundSize: zoomStyle.backgroundSize || 'contain',
              backgroundPosition: zoomStyle.backgroundPosition || 'center',
              backgroundRepeat: 'no-repeat',
              cursor: 'zoom-in',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {product.images.slice(0, 4).map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Product ${index + 1}`}
                onClick={() => setMainImage(image)}
                sx={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: mainImage === image ? '3px solid #1976d2' : '2px solid #ddd',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            {product.name}
          </Typography>
          <Typography variant="h4" sx={{ color: 'green', marginBottom: '10px' }}>
            ₹{product.salesPrice}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: product.stockQuantity > 0 ? 'blue' : 'red', marginBottom: '10px' }}
          >
            {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
          </Typography>
          <Typography sx={{ marginBottom: '20px' }}>{product.description}</Typography>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddToCart}
              startIcon={<ShoppingCartIcon />}
              sx={{
                borderRadius: '30px',
                padding: '12px 30px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'normal',
                borderColor: '#1976d2',
                color: '#1976d2',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                },
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAddToWishlist}
              startIcon={<FavoriteIcon />}
              sx={{
                borderRadius: '30px',
                padding: '12px 30px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'normal',
                borderColor: '#e91e63',
                color: '#e91e63',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e91e63',
                  color: 'white',
                },
              }}
            >
              Add to Wishlist
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ margin: '40px 0' }} />

      {/* Recommended Products */}
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Recommended Products
      </Typography>
      <Grid container spacing={3}>
        {recommendedProducts.map((recProduct) => (
          <Grid item xs={12} sm={6} md={4} key={recProduct._id}>
            <ProductCard product={recProduct} variant="trending" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductDetail;
