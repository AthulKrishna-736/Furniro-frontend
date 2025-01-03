import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProductCard from '../products/card/productCard';

const HomeBody = ({ products = [] }) => {
  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      {/* Product Grid */}
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
                width: '50%', // Adjust width of the underline
                height: '2px', // Thickness of the underline
                backgroundColor: '#ddd',
                bottom: '0', // Align underline at the bottom
                left: '25%', // Center the underline
            },
            }}
            >
            Featured Products
        </Typography>
        </Box>

      {/* Display a message if there are no products */}
      {products.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HomeBody;
