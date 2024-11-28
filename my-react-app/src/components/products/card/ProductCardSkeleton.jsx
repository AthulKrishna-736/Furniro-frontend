import React from 'react';
import { Card, Box, Skeleton } from '@mui/material';

const ProductCardSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: 345, // Matches ProductCard
        border: '1px solid #ddd', // Same border as ProductCard
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 6, // Optional hover effect for skeleton
        },
        padding: 0, // Matches ProductCard padding
        margin: '10px',
      }}
    >
      {/* Image Skeleton */}
      <Box
        sx={{
          borderBottom: '1px solid #ddd', // Matches image border in ProductCard
          backgroundColor: '#f9f9f9', // Same as ProductCard
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="330px"
          height={200} // Matches image height
        />
      </Box>

      {/* Content Skeleton */}
      <Box
        sx={{
          padding: 2, // Matches content padding in ProductCard
          borderBottom: '1px solid #ddd', // Same bottom border
        }}
      >
        {/* Product Title Skeleton */}
        <Skeleton
          variant="text"
          animation="wave"
          height={30}
          width="70%" // Matches approximate title width
          sx={{ marginBottom: 1 }}
        />
        {/* Description Skeleton */}
        <Skeleton variant="text" animation="wave" height={20} width="90%" />
        <Skeleton variant="text" animation="wave" height={20} width="80%" />
      </Box>

      {/* Price and Actions Skeleton */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2, // Matches actions section padding
          borderTop: '1px solid #ddd', // Matches top border
        }}
      >
        {/* Price Skeleton */}
        <Skeleton variant="text" animation="wave" height={30} width="30%" />
        {/* Placeholder for Action Buttons */}
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;
