import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, TextField, Button, IconButton, Pagination } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ProductCard from '../card/productCard';
import axiosInstance from '../../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductsUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [sortValue, setSortValue] = useState('');

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
      }
    };
  
    fetchProducts();
  }, []);

  
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortValue(value);

    let sortedProducts = [...products];

    switch (value) {
      case 'low-high':
        sortedProducts.sort((a, b) => a.salesPrice - b.salesPrice); 
        break;
      case 'high-low':
        sortedProducts.sort((a,b)=> b.salesPrice - a.salesPrice);
        break;
      case 'new-arrivals':
        sortedProducts.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'a-z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
        break;
      case 'z-a':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  
  };


  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePageChange = (event, value) => setPage(value);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortValue('');
    setProducts([...products]);
  }

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
        <FormControl
      variant="standard"
      sx={{
        minWidth: 150,
        '& .MuiSelect-root': {
          padding: '0.4rem 1rem',
          fontSize: '0.9rem',
          color: '#000',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: '#000', // Arrow color
        },
      }}
    >
      <Select
        value={sortValue}
        onChange={handleSortChange}
        displayEmpty
        sx={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          backgroundColor: '#fff',
        }}
      >
        <MenuItem value="" disabled>
          Filter 
        </MenuItem>
        <MenuItem value="low-high">Price: Low to High</MenuItem>
        <MenuItem value="high-low">Price: High to Low</MenuItem>
        <MenuItem value="new-arrivals">New Arrivals</MenuItem>
        <MenuItem value="a-z">aA-zZ</MenuItem>
        <MenuItem value="z-a">zZ-aA</MenuItem>
      </Select>
    </FormControl>

        {/* Styled Clear Button */}
        <Button
          variant="text"
          onClick={handleClearFilters}
          sx={{
            textTransform: 'capitalize',
            padding: '0.5rem 0.5rem',
            fontWeight: 'bold',
            color: 'gray',
            borderColor: '#d32f2f',
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: '#ffebee',
              borderColor: '#b71c1c',
            },
          }}
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
        <>
        {/* <ToastContainer position="top-right" autoClose={2000} hideProgressBar /> */}
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          </>
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
