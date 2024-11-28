import React, { useState, useEffect } from 'react';
import ProductCard from '../card/productCard';
import ProductCardSkeleton from '../card/ProductCardSkeleton';
import { Typography, Box } from '@mui/material';
import axiosInstance from '../../../utils/axiosInstance';

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axiosInstance.get('/user/trendingProducts');
        const allProducts = response?.data?.products || [];
  
        // Filter out blocked products
        const unblockedProducts = allProducts.filter(product => !product.isBlocked);
  
        // Randomly shuffle the products and select 4
        const shuffledProducts = unblockedProducts.sort(() => Math.random() - 0.5);
        const trending = shuffledProducts.slice(0, 4).map(product => ({
          ...product,
          name: `${product.name.slice(0, 20)}...`, // Slice the name directly
        }));
  
        setTrendingProducts(trending);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setError('Failed to fetch trending products');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTrendingProducts();
  }, []);
  
  
  return (
    <Box sx={{ marginTop: '20px' }}>
      {/* Section Title */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            position: 'relative',
            paddingBottom: '8px',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: '50%',
              height: '2px',
              backgroundColor: '#ddd',
              bottom: '0',
              left: '25%',
            },
          }}
        >
          Trending Products
        </Typography>
      </Box>

      {/* Trending Products Content */}
      {loading ? (
        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </Box>
      ) : error ? (
        <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>
      ) : (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              '& > *': {
                flexShrink: 0,
                flexBasis: 'calc(22% - 16px)', // Adjusted from 20% to 22%
                maxWidth: 'calc(22% - 16px)', // Adjusted size
              },
            }}
          >
          {trendingProducts.filter(product => product && product._id).map(product => (
            <ProductCard key={product._id} product={product} variant="trending" />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TrendingProducts;
