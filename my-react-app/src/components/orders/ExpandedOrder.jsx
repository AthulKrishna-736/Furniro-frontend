import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';

const ExpandedOrder = ({ order, handleAlertClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Box sx={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {/* Toggle Button */}
            <Button onClick={() => setIsExpanded(!isExpanded)} sx={{ display: 'flex', alignItems: 'center', gap: '5px', padding: 0, backgroundColor: 'transparent', '&:hover': { textDecoration: 'underline' } }}>
                {isExpanded ? 'Hide Products' : 'Show Products'}
                <ExpandMoreIcon sx={{ fontSize: '24px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            </Button>

            {/* Product List */}
            {isExpanded && (
                <Box sx={{ marginTop: '20px' }}>
                    {order.orderedItems.map(item => (
                        <Box
                            key={item.productId}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between', // Ensures proper spacing between left, center, and right
                                marginBottom: '15px', // Increased margin for better spacing
                            }}
                        >
                            {/* Product Image and Name - Left End */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}> {/* Increased gap */}
                                <img
                                    src={item.image}
                                    alt={item.name || 'Product Image'}
                                    width="70" // Increased image size
                                    height="70" // Increased image size
                                    style={{ borderRadius: '8px', objectFit: 'cover' }} // Slightly larger border radius
                                />
                                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '16px' }}> {/* Increased font size */}
                                    {item.name || 'No name'}
                                </Typography>
                            </Box>

                            {/* Product Details - Center */}
                            <Box sx={{ display: 'flex', gap: '15px', flex: 1, justifyContent: 'center' }}> {/* Increased gap */}
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>₹{item.price}</Typography> {/* Increased font size */}
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>Qty: {item.quantity}</Typography> {/* Increased font size */}
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                    Total: ₹{item.quantity * item.price}
                                </Typography> {/* Increased font size */}
                            </Box>

                            {/* Status and Action Buttons - Right End */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '180px', justifyContent: 'flex-end' }}> {/* Increased gap and minWidth */}
                                {/* Status */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '14px',
                                        color: 'gray',
                                        backgroundColor: '#f0f0f0',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                    }}
                                >
                                    Status: {item.status}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    {/* Cancel Button - Only for non-cancelled products */}
                                    {item.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
                                        <Button
                                            onClick={() => handleAlertClick(order.orderId, 'cancelProduct', item.productId)}
                                            sx={{
                                                color: '#dc3545',
                                                textTransform: 'none',
                                                padding: '4px 10px',
                                                minWidth: 'unset',
                                                fontSize: '14px',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            <CancelIcon sx={{ fontSize: '18px', marginRight: '5px' }} />
                                            Cancel
                                        </Button>
                                    )}

                                    {/* Return Button - Only for delivered orders and non-cancelled products */}
                                    {item.status === 'Delivered' && item.status !== 'Cancelled' && (
                                        <Button
                                            onClick={() => handleAlertClick(order.orderId, 'returnProduct', item.productId)}
                                            sx={{
                                                color: '#007bff',
                                                textTransform: 'none',
                                                padding: '4px 10px',
                                                minWidth: 'unset',
                                                fontSize: '14px',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            <ReplayIcon sx={{ fontSize: '18px', marginRight: '5px' }} />
                                            Return
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ExpandedOrder;