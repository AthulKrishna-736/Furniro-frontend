import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { FavoriteBorder, ShoppingBagOutlined, PersonOutline, Logout } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/features/userAuth';


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getButtonStyle = (path) => ({
        color: location.pathname === path ? '#5c6bc0' : 'black', // Change color for active link
        borderBottom: location.pathname === path ? '2px solid #5c6bc0' : 'none', // Add underline for active link
        fontWeight: location.pathname === path ? 'bold' : 'normal', // Optional: Bold font for active link
        paddingBottom: '4px',
      });

      const handleLogout = async () => {
        try {
          // Send logout request to the server
          const response = await axiosInstance.post('/user/logout', {}, { withCredentials: true });
          console.log('response of logout = ', response.data.message);
    
          // Dispatch Redux action to clear user ID from the store
          dispatch(logoutUser());
          // localStorage.removeItem('userId');
    
          // Navigate to login page
          navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error.response?.data?.message);
        }
      };

  return (
<AppBar
  position="static"
  sx={{
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'none',
    width: '100%',
    overflowX: 'hidden',
  }}
>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: { xs: '0 8px', md: '0 16px' } }}>
    {/* Logo on the left */}
    <Typography
      variant="h5"
      component="div"
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: '600',
        fontSize: '1.8rem',
        color: '#333',
        letterSpacing: '0.5px',
        padding: '4px',
        transition: 'color 0.3s ease',
        '&:hover': { color: '#5c6bc0' },
      }}
    >
      Furniro
    </Typography>

    {/* Centered Navbar Links */}
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 3,
      }}
    >
          <Button onClick={() => navigate('/home')} sx={getButtonStyle('/home')}>Home</Button>
          <Button onClick={() => navigate('/products')} sx={getButtonStyle('/products')}>Products</Button>
          <Button onClick={() => navigate('/brands')} sx={getButtonStyle('/brands')}>Brands</Button>
          <Button onClick={() => navigate('/about-us')} sx={getButtonStyle('/about-us')}>About Us</Button>
          <Button onClick={() => navigate('/contact-us')} sx={getButtonStyle('/contact-us')}>Contact Us</Button>
    </Box>

    {/* Icons and Logout Button on the right */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton color="inherit" sx={{ color: 'black' }}>
        <FavoriteBorder />
      </IconButton>
      <IconButton color="inherit" sx={{ color: 'black' }}>
        <ShoppingBagOutlined />
      </IconButton>
      <IconButton color="inherit" sx={{ color: 'black' }}>
        <PersonOutline />
      </IconButton>
      <Button
        onClick={handleLogout}
        startIcon={<Logout />}
        sx={{ color: 'black', fontWeight: 'bold', textTransform: 'none' }}
      >
        Logout
      </Button>
    </Box>
  </Toolbar>
</AppBar>
  )
}

export default Navbar;