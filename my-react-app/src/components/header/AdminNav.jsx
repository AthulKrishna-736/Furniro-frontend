import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/features/userAuth'; // Assuming logoutUser is in redux slice

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminId'); // Remove adminId from localStorage
    dispatch(logoutUser()); // Dispatch logout action
    navigate('/admin-login'); // Navigate to admin login page after logout
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        width: '100%',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', padding: { xs: '0 8px', md: '0 16px' } }}>
        {/* Profile and Logout Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" sx={{ color: 'black' }}>
            <AccountCircle />
          </IconButton>
          <Button
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{ color: 'black', fontWeight: 'bold', textTransform: 'none' }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
