import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { AiOutlineUser, AiOutlineHome, AiOutlineShoppingCart, AiOutlineWallet } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const menuItems = [
    { label: 'Account', icon: <AiOutlineUser />, path: '/profile' },
    { label: 'Address', icon: <AiOutlineHome />, path: '/address' },
    { label: 'Orders', icon: <AiOutlineShoppingCart />, path: '/orders' },
    { label: 'Wallet', icon: <AiOutlineWallet />, path: '/wallet' },
  ];

  const handleNavigation = (path) => {
    setSelected(path);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        background: '#fff', // Light blue background
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '20px',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #bbdefb',
      }}
    >
      {/* Sidebar Header */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontFamily: "'Poppins', sans-serif",
          color: '#1565c0', // Darker blue for text
          textTransform: 'uppercase',
        }}
      >
        Furniro
      </Typography>

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              marginBottom: '10px',
              backgroundColor: selected === item.path ? '#90caf9' : 'transparent', // Lighter blue for selected
              color: selected === item.path ? '#fff' : '#000', // White for selected text
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#64b5f6', // Slightly darker blue on hover
                color: '#fff', // White text and icons on hover
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: selected === item.path ? '#fff' : '#000',
                minWidth: '40px',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: '500',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default UserSidebar;
