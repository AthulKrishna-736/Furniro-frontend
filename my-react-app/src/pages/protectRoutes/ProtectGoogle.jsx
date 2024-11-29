import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ProtectGoogle = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      navigate('/oauth/start');
    }else{
      navigate('/home')
    }
  }, [navigate]);

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      bgcolor: "background.default", 
    }}
  >
    <CircularProgress size={70} thickness={5} color="primary" />
    <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
      Redirecting to Please wait...
    </Typography>
  </Box>
  );
};

export default ProtectGoogle;
