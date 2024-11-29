import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

const Banner = ({ image, text, hideText = false }) => {
  return (
    <Box sx={{ textAlign: 'center', marginBottom: '20px', marginTop: '80px' }}>
      {!hideText && (
        <>
          <Divider />
          {/* Typography (Headline) */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              marginBottom: '20px', // Space between text and banner image
              marginTop: '30px', // Top margin for more space
              color: '#333',
              paddingBottom: '10px',
            }}
          >
            {text}
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
        </>
      )}

      {/* Banner Image */}
      <Box
        sx={{
          height: '300px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginBottom: '20px',
        }}
      />
    </Box>
  );
};

export default Banner;