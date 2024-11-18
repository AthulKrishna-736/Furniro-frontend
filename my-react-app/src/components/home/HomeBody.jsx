import React from 'react'
import { Box, Typography } from '@mui/material';

const HomeBody = () => {
  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      {/* Headline */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
        Choose the Best, Find Your Perfect Piece in Our Store.
      </Typography>

      {/* Banner Image */}
      <Box
        sx={{
          height: '300px',
          backgroundImage: `url('https://t4.ftcdn.net/jpg/05/08/17/01/360_F_508170187_4Oonk4IG8u9eyfwSUvTASkT8hl71vRX2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      />
    </Box>
  )
}

export default HomeBody;