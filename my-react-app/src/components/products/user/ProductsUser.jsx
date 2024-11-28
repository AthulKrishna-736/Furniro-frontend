import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Pagination } from '@mui/material';
import { Search, Clear, FilterAlt } from '@mui/icons-material';
import ProductCard from '../card/productCard';
import axiosInstance from '../../../utils/axiosInstance';

const ProductsUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/user/products');
        const allProducts = response?.data?.products || [];
  
        // Filter out blocked products and categories
        const unblockedProducts = allProducts.filter(
          product => !product.isBlocked && !product.category?.isBlocked
        );
  
        // Slice product names to 20 characters if needed
        const featuredProducts = unblockedProducts.map(product => ({
          ...product,
          name: product.name.slice(0, 20), // Slice product name to 20 characters
        }));
  
        setProducts(featuredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.');
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePageChange = (event, value) => setPage(value);

  const handleClearFilters = () => setSearchQuery('');

  return (
    <Box sx={{ padding: '2rem', marginTop: '30px', textAlign: 'center' }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
        Discover Quality Furniture for Every Home
      </Typography>

      {/* Search and Filter Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          marginBottom: '2rem',
        }}
      >
        {/* Styled Search Bar */}
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: '300px',
            borderRadius: '30px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search sx={{ color: '#1976d2' }} />
              </IconButton>
            ),
          }}
        />

        {/* Styled Filter Button */}
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: '#fff',
            textTransform: 'capitalize',
            padding: '0.5rem 1.5rem',
            fontWeight: 'bold',
            borderRadius: '30px',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
            },
          }}
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>

        {/* Styled Clear Button */}
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          sx={{
            textTransform: 'capitalize',
            padding: '0.5rem 1.5rem',
            fontWeight: 'bold',
            color: '#d32f2f',
            borderColor: '#d32f2f',
            borderRadius: '30px',
            '&:hover': {
              backgroundColor: '#ffebee',
              borderColor: '#b71c1c',
            },
          }}
          startIcon={<Clear />}
        >
          Clear All
        </Button>
      </Box>

      {/* Products Display */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}
      >
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination
          count={10}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default ProductsUser;
