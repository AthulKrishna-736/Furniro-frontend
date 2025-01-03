import React from 'react'
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate();

  return (
    <Box 
    sx={{ 
        backgroundColor: '#f3e8d9', // Light wooden color for a wooden theme
        color: 'black', 
        padding: '40px 0',
    }}
    >
    <Box
        sx={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '40px',
        paddingX: '20px',
        }}
    >
        {/* Exclusive Section */}
        <Box sx={{ flex: 1, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Exclusive
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
            Subscribe
        </Typography>
        <Typography
            variant="body2"
            sx={{
            display: 'inline-block',
            padding: '8px 16px',
            border: '1px solid black',
            borderRadius: '4px',
            color: 'black',
            }}
        >
            Get 10% off your first order
        </Typography>
        </Box>

        {/* Support Section */}
        <Box sx={{ flex: 1, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Support
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '6px' }}>Maradu, Kochi, Ernakulam, Kerala.</Typography>
        <Typography variant="body2" sx={{ marginBottom: '6px' }}>furniro@gmail.com</Typography>
        <Typography variant="body2">+91 994-7069-004</Typography>
        </Box>

        {/* Account Section */}
        <Box sx={{ flex: 1, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Account
        </Typography>
        <Box>
            <Button onClick={() => navigate('/account')} sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            My Account
            </Button>
            <Button onClick={() => navigate('/login')} sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Login / Register
            </Button>
            <Button onClick={() => navigate('/cart')} sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Cart
            </Button>
            <Button onClick={() => navigate('/wishlist')} sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Wishlist
            </Button>
            <Button onClick={() => navigate('/about-us')} sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            About
            </Button>
        </Box>
        </Box>

        {/* Quick Links Section */}
        <Box sx={{ flex: 1, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Quick Link
        </Typography>
        <Box>
            <Button sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Privacy Policy
            </Button>
            <Button sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Terms Of Use
            </Button>
            <Button sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            FAQ
            </Button>
            <Button sx={{ color: 'inherit', display: 'block', textAlign: 'left', padding: '2px 0' }}>
            Contact
            </Button>
        </Box>
        </Box>
    </Box>

    {/* Footer Bottom */}
    <Box sx={{ width: '100%', marginTop: '40px', textAlign: 'center' }}>
        <hr style={{ borderColor: '#555', width: '100%' }} />
        <Typography
        variant="body2"
        sx={{
            color: '#888',
            fontSize: '0.8rem',
            paddingTop: '10px',
            paddingBottom: '10px',
        }}
        >
        © Copyright Furniro 2024. All rights reserved
        </Typography>
    </Box>
    </Box>
  )
}

export default Footer;