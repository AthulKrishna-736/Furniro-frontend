import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AiOutlineDashboard, AiOutlineShoppingCart, AiOutlineAppstoreAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { CardGiftcard, BarChart } from '@mui/icons-material';
import { BiCategoryAlt, BiImageAdd } from 'react-icons/bi';
import LocalOffer from '@mui/icons-material/LocalOffer'
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Detect the current route
  const [selected, setSelected] = useState(location.pathname); // Track active menu

  const handleNavigation = (path) => {
    setSelected(path); // Update the active menu
    navigate(path); // Navigate to the selected path
  };

  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
        boxShadow: '4px 0px 15px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 10px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        borderRight: '1px solid #ddd',
      }}
    >
      {/* Project Name */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          padding: '16px 0',
          fontFamily: "'Inter', sans-serif",
          color: '#3b5998',
          letterSpacing: '1px',
        }}
      >
        Admin Panel
      </Typography>
      <Divider sx={{ margin: '0 10px' }} />

      {/* Navigation Links */}
      <List>
        {/* Dashboard */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-dashboard')}
          sx={{
            backgroundColor: selected === '/admin-dashboard' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-dashboard' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-dashboard' ? '#1976d2' : '#555',
              fontSize: '22px', 
              transition: 'color 0.3s ease',
            }}
          >
            <AiOutlineDashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        {/* Orders */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-orders')}
          sx={{
            backgroundColor: selected === '/admin-orders' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-orders' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-orders' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <AiOutlineShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Orders" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        {/* Products */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-products')}
          sx={{
            backgroundColor: selected === '/admin-products' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-products' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-products' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <AiOutlineAppstoreAdd />
          </ListItemIcon>
          <ListItemText primary="Products" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        {/* Categories */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-categories')}
          sx={{
            backgroundColor: selected === '/admin-categories' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-categories' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-categories' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <BiCategoryAlt />
          </ListItemIcon>
          <ListItemText primary="Categories" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        {/* Users */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-users')}
          sx={{
            backgroundColor: selected === '/admin-users' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-users' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-users' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <AiOutlineUsergroupAdd />
          </ListItemIcon>
          <ListItemText primary="Users" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        {/* Banners */}
        <ListItemButton
          onClick={() => handleNavigation('/admin-banners')}
          sx={{
            backgroundColor: selected === '/admin-banners' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-banners' ? '#1976d2' : '#333',
            '&:hover': { 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-banners' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <BiImageAdd />
          </ListItemIcon>
          <ListItemText primary="Banners" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        <ListItemButton
          onClick={() => handleNavigation('/admin-coupons')}
          sx={{
            backgroundColor: selected === '/admin-coupons' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-coupons' ? '#1976d2' : '#333',
            '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon sx={{ color: selected === '/admin-coupons' ? '#1976d2' : '#555', fontSize: '22px', transition: 'color 0.3s ease' }}>
            <CardGiftcard />
          </ListItemIcon>
          <ListItemText primary="Coupons" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

        <ListItemButton
          onClick={() => handleNavigation('/admin-offers')}
          sx={{
            backgroundColor: selected === '/admin-offers' ? '#e3f2fd' : 'transparent',
            color: selected === '/admin-offers' ? '#1976d2' : '#333',
            '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
          }}
        >
          <ListItemIcon
            sx={{
              color: selected === '/admin-offers' ? '#1976d2' : '#555',
              fontSize: '22px',
              transition: 'color 0.3s ease',
            }}
          >
            <LocalOffer /> {/* Icon for Offers */}
          </ListItemIcon>
          <ListItemText primary="Offers" sx={{ fontWeight: '500', fontSize: '16px' }} />
        </ListItemButton>

        <Divider sx={{ margin: '5px 0' }} />

<ListItemButton
  onClick={() => handleNavigation('/admin-sales-report')}
  sx={{
    backgroundColor: selected === '/admin-sales-report' ? '#e3f2fd' : 'transparent',
    color: selected === '/admin-sales-report' ? '#1976d2' : '#333',
    '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
    transition: 'all 0.3s ease',
    borderRadius: '8px',
  }}
>
  <ListItemIcon
    sx={{
      color: selected === '/admin-sales-report' ? '#1976d2' : '#555',
      fontSize: '22px',
      transition: 'color 0.3s ease',
    }}
  >
    <BarChart /> {/* Icon for Sales Report */}
  </ListItemIcon>
  <ListItemText primary="Sales Report" sx={{ fontWeight: '500', fontSize: '16px' }} />
</ListItemButton>

      </List>
    </Box>
  );
};

export default AdminSidebar;
