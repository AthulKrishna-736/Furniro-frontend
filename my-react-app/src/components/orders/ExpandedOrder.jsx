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
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: 0,
          backgroundColor: 'transparent',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {isExpanded ? 'Hide Products' : 'Show Products'}
        <ExpandMoreIcon
          sx={{
            fontSize: '24px',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Button>

      {/* Product List */}
      {isExpanded &&
        order.orderedItems.map((item) => {
          const isDelivered = item.status === 'Delivered';
          const isNotRequested =
            item.returnRequest?.status === 'Not Requested' || !item.returnRequest?.status;

          return (
            <Box
              key={item.productId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px',
              }}
            >
              {/* Product Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img
                  src={item.image}
                  alt={item.name || 'Product Image'}
                  width="70"
                  height="70"
                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '16px' }}>
                  {item.name || 'No name'}
                </Typography>
              </Box>

              {/* Price and Quantity */}
              <Box sx={{ display: 'flex', gap: '15px', flex: 1, justifyContent: 'center' }}>
                <Typography variant="body2">₹{item.price}</Typography>
                <Typography variant="body2">Qty: {item.quantity}</Typography>
                <Typography variant="body2">Total: ₹{item.quantity * item.price}</Typography>
              </Box>

              {/* Status and Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'flex-end' }}>
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

                {/* Return Request Status */}
                {item.returnRequest?.status !== 'Not Requested' && item.returnRequest?.status  && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#dc3545', fontWeight: 500 }}>
                      Return Status: {item.returnRequest.status}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: 'gray' }}>
                      Requested At: {new Date(item.returnRequest.requestedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  {/* Cancel Button */}
                  {item.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
                    <Button
                      onClick={() => handleAlertClick(order.orderId, 'cancelProduct', item.productId)}
                      sx={{
                        color: '#dc3545',
                        textTransform: 'none',
                        fontSize: '14px',
                        padding: '4px 10px',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <CancelIcon sx={{ fontSize: '18px', marginRight: '5px' }} />
                      Cancel
                    </Button>
                  )}

                  {/* Return Button */}
                  {isDelivered && isNotRequested && (
                    <Button
                      onClick={() => handleAlertClick(order.orderId, 'returnProduct', item.productId)}
                      sx={{
                        color: '#007bff',
                        textTransform: 'none',
                        fontSize: '14px',
                        padding: '4px 10px',
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
          );
        })}
    </Box>
  );
};

export default ExpandedOrder;