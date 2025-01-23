import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const OrderProgress = ({ order, steps }) => {
  const getProgressValue = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 33;
      case 'Shipped':
        return 66;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  const progressValue = getProgressValue(order.status);

  return (
    <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
      {order.status === 'Cancelled' || order.status === 'Returned' ? (
        <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
          <CancelIcon
            sx={{
              fontSize: '60px',
              marginBottom: '10px',
              color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107',
            }}
          >
            {order.status === 'Cancelled' ? 'Order Cancelled' : 'Order Returned'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            {order.status === 'Cancelled'
              ? 'This order has been cancelled and is no longer being processed.'
              : 'This order has been returned successfully.'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                position: 'absolute',
                top: '20px',
                left: 0,
                width: '100%',
                height: '2px',
                borderRadius: '4px',
                backgroundColor: '#ddd',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#6c63ff',
                },
              }}
            />

            {/* Icons and Labels */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {steps.map((step, index) => {
                const stepPercentage = (index / (steps.length - 1)) * 100;
                const isActive = stepPercentage <= progressValue + 1;
                const isCurrent = stepPercentage === progressValue;

                return (
                  <Box
                    key={step.label}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'absolute',
                      left: `${stepPercentage}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Icon Circle */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        backgroundColor: isActive || isCurrent ? '#6c63ff' : '#ddd',
                        color: isActive || isCurrent ? '#fff' : '#000',
                      }}
                    >
                      {React.cloneElement(step.icon, { fontSize: '20px' })}
                    </Box>

                    {/* Label */}
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: '5px',
                        color: isActive || isCurrent ? '#6c63ff' : '#aaa',
                        fontSize: '12px',
                      }}
                    >
                      {step.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderProgress;
