import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const ConfirmationAlert = ({
  open,
  onClose,
  onConfirm,
  message = "",
  title = ""
}) => {
  // Custom Styled Buttons
  const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    padding: '12px 30px',
    fontSize: '16px',
    textTransform: 'none',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    backgroundImage: 'linear-gradient(45deg, #ff6b6b, #f06595)',
    color: '#fff',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
      backgroundImage: 'linear-gradient(45deg, #f06595, #d6336c)',
    },
    '&.noButton': {
      backgroundImage: 'linear-gradient(45deg, #339af0, #228be6)',
      '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #228be6, #1c7ed6)',
      },
    },
  }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 }, // Responsive width
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          p: 4,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            fontSize: '22px',
            color: '#343a40',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: '16px',
            color: '#6c757d',
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
          <StyledButton onClick={onConfirm} sx={{ width: '130px' }}>
            Yes
          </StyledButton>
          <StyledButton className="noButton" onClick={onClose} sx={{ width: '130px' }}>
            No
          </StyledButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationAlert;
