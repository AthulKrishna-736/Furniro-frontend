import React from 'react';
import Navbar from '../../components/header/Navabar';
import Footer from '../../components/footer/Footer';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Container,
    Card,
    Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NatureIcon from "@mui/icons-material/Nature";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AboutUs = () => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* About Us Section */}
            <Container
                maxWidth="xl"
                sx={{
                    marginTop: '80px',
                    padding: { xs: 2, sm: 4 },
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f9fafb, #ffffff)', // Elegant white theme
                    color: '#4a4a4a', 
                }}
            >
                <Typography
                    sx={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: 4,
                        color: '#3b82f6', // Subtle blue accent
                    }}
                >
                    About Furniro
                </Typography>

                {/* Company Story */}
                <Box
                    sx={{
                        marginBottom: 6,
                        backgroundColor: '#ffffff',
                        borderRadius: 4,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        padding: 4,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: 2,
                            color: '#3b82f6',
                        }}
                    >
                        Our Story
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.2rem',
                            lineHeight: 1.8,
                            color: '#4a4a4a',
                            marginBottom: 2,
                        }}
                    >
                        Furniro began as a small workshop in a quaint town, where artisans poured their heart and soul into crafting exquisite wooden furniture. Over time, our dedication to quality, innovation, and customer satisfaction turned us into a trusted name in the industry.
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.2rem',
                            lineHeight: 1.8,
                            color: '#4a4a4a',
                        }}
                    >
                        Our mission is to enrich your living spaces with furniture that is not only functional but also an expression of beauty and sustainability. We believe in creating memories through the warmth of wood and the essence of home.
                    </Typography>
                </Box>

                {/* Trusted by Customers */}
                <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
                    <Typography
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: 3,
                            color: '#3b82f6',
                        }}
                    >
                        Why Customers Trust Us
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 4,
                                    background: '#f9fafb',
                                }}
                            >
                                <Avatar sx={{ backgroundColor: '#e0f2fe', margin: '0 auto', marginBottom: 2 }}>
                                    <CheckCircleIcon sx={{ color: '#3b82f6' }} />
                                </Avatar>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                    100%
                                </Typography>
                                <Typography sx={{ fontSize: '1rem', color: '#4a4a4a' }}>
                                    Reliable Service
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 4,
                                    background: '#f9fafb',
                                }}
                            >
                                <Avatar sx={{ backgroundColor: '#e0f2fe', margin: '0 auto', marginBottom: 2 }}>
                                    <EmojiEventsIcon sx={{ color: '#3b82f6' }} />
                                </Avatar>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                    10,000+
                                </Typography>
                                <Typography sx={{ fontSize: '1rem', color: '#4a4a4a' }}>
                                    Happy Customers
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 4,
                                    background: '#f9fafb',
                                }}
                            >
                                <Avatar sx={{ backgroundColor: '#e0f2fe', margin: '0 auto', marginBottom: 2 }}>
                                    <NatureIcon sx={{ color: '#3b82f6' }} />
                                </Avatar>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                    Eco-Friendly
                                </Typography>
                                <Typography sx={{ fontSize: '1rem', color: '#4a4a4a' }}>
                                    Sustainable Practices
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 4,
                                    background: '#f9fafb',
                                }}
                            >
                                <Avatar sx={{ backgroundColor: '#e0f2fe', margin: '0 auto', marginBottom: 2 }}>
                                    <SupportAgentIcon sx={{ color: '#3b82f6' }} />
                                </Avatar>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                    24/7
                                </Typography>
                                <Typography sx={{ fontSize: '1rem', color: '#4a4a4a' }}>
                                    Customer Support
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutUs;
