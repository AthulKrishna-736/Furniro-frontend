import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [logStatus, setLogStatus] = useState(false);

  const getButtonStyle = (path) => ({
    color: location.pathname === path ? '#5c6bc0' : 'black', // Change color for active link
    borderBottom: location.pathname === path ? '2px solid #5c6bc0' : 'none', // Add underline for active link
    fontWeight: location.pathname === path ? 'bold' : 'normal', // Optional: Bold font for active link
    paddingBottom: '4px',
  });

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/user/logout', {}, { withCredentials: true });
      console.log('response of logout = ', response.data.message);
      localStorage.removeItem('email');
      localStorage.removeItem('userEmail');
      dispatch(logoutUser());
      console.log('localstoreage in navbar: ', localStorage)
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message);
    }
  };

  const checkLogStatus = ()=>{
    if(localStorage.getItem('userId')){
      console.log('user id has val')
      setLogStatus(true);
    }else{
      console.log('user id not have value')
      setLogStatus(false);
    }
  }

  useEffect(() => {
    //check log status
    checkLogStatus();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: scrolled ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        width: '100%',
        transition: 'box-shadow 0.3s ease-in-out',
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
          <Button onClick={() => navigate('/about-us')} sx={getButtonStyle('/about-us')}>About Us</Button>
        </Box>

        {/* Icons and Logout Button on the right */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" sx={{ color: 'black' }} onClick={()=> navigate('/wishlist')}>
            <FavoriteBorder />
          </IconButton >
          <IconButton color="inherit" sx={{ color: 'black' }} onClick={()=> navigate('/cart')}>
            <ShoppingBagOutlined />
          </IconButton>
          <IconButton color="inherit" sx={{ color: 'black' }} onClick={()=> navigate('/account')}>
            <PersonOutline />
          </IconButton>
          {logStatus ? (
            <Button
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'none',
                border: '1px solid #5c6bc0',
                padding: '4px 16px',
                borderRadius: '4px',
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'none',
                border: '1px solid #5c6bc0',
                padding: '4px 16px',
                borderRadius: '4px',
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
