import React, { useState, useEffect } from 'react';
import {
  FormControl,
  MenuItem,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Pagination,
} from '@mui/material';
import { Search, FilterList, Delete } from '@mui/icons-material';
import ProductCard from '../card/productCard';
import axiosInstance from '../../../utils/axiosInstance';

const ProductsUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [sortValue, setSortValue] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [cateogory, setCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 

  const limit = 8; 

  const fetchProducts = async () => {
    try {
      const params = {
        page,
        limit,
        sortBy: sortValue,
        categoryId : selectedCategoryId,
      };

      const [productResponse, offersResponse] = await Promise.all([
        axiosInstance.get('/user/products', { params }),
        axiosInstance.get('/admin/catoffers'), 
      ]);
  
      // Extract data from the responses
      const { products: fetchedProducts, totalPages } = productResponse.data;
      const offers = offersResponse.data.products;
      console.log(productResponse.data)
      console.log(offers);

      const productsWithOffers = fetchedProducts.map((product) => {
        const offer = offers.find((offerItem) => offerItem._id === product._id);
  
        if (offer) {
          return {
            ...product,
            discountPrice: offer.discountPrice,
            discountValue: offer.discountValue,
            discountType: offer.discountType,
          };
        }
  
        return product;
      });

      setProducts(productsWithOffers);
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(()=>{
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get('/admin/getCat')
        setCategory(response.data.categories)
      } catch (error) {
        console.log('error fetch cat in filter: ',error);
      }
    }
    fetchCategory()
  },[])

  useEffect(() => {
    fetchProducts();
  }, [page, sortValue, selectedCategoryId]); 

  const handleSortChange = (event) => setSortValue(event.target.value);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };
  
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  useEffect(() => {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filteredProducts);
  }, [searchQuery, products]);

  const handlePageChange = (event, value) => setPage(value);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortValue('');
    setSelectedCategoryId('');
    setPage(1); 
    fetchProducts();
  };

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
        {/* Search Bar */}
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

        {/* Filter Dropdown */}
        <FormControl
          sx={{
            position: 'relative',
            minWidth: 100,
            '&:hover > .dropdown': { display: 'flex' },
          }}
        >
          {/* Filter Button */}
          <Button
            sx={{
              textTransform: 'capitalize',
              border: '1px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#fff',
              width: '100%',
              padding: '10px',
              fontWeight: 'bold',
              color: '#333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            startIcon={<FilterList />}
          >
            Filter
          </Button>

          {/* Dropdown Menu */}
          <Box
            className="dropdown"
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '440px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '10px',
              zIndex: 10,
              display: 'none',
              flexDirection: 'row', 
              gap: '20px',
              padding: '15px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Dropdown Sections */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#444',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                }}
              >
                Price
              </Typography>
              <MenuItem
                onClick={() => handleSortChange({ target: { value: 'low-high' } })}
                sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                Low to High
              </MenuItem>
              <MenuItem
                onClick={() => handleSortChange({ target: { value: 'high-low' } })}
                sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                High to Low
              </MenuItem>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#444',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                }}
              >
                Latest
              </Typography>
              <MenuItem
                onClick={() => handleSortChange({ target: { value: 'new-arrivals' } })}
                sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                New Arrivals
              </MenuItem>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#444',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                }}
              >
                Name
              </Typography>
              <MenuItem
                onClick={() => handleSortChange({ target: { value: 'a-z' } })}
                sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                A-Z
              </MenuItem>
              <MenuItem
                onClick={() => handleSortChange({ target: { value: 'z-a' } })}
                sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                Z-A
              </MenuItem>
            </Box>

            {/* Dynamic Categories Section */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#444',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                }}
              >
                Categories
              </Typography>
              {cateogory.map((cat, idx) => (
                <MenuItem
                  key={idx}
                  onClick={() => handleCategorySelect(cat.id)}
                  sx={{ padding: '8px', borderRadius: '5px', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Box>
          </Box>
        </FormControl>


        {/* Clear Filters Button */}
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
          }}
          startIcon={<Delete />}
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
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <Typography>No products found.</Typography>
        )}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination
          count={totalPages}
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
