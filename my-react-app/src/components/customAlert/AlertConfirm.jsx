import React from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const AlertConfirm = ({ open, message, onConfirm, onCancel }) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography
          id="modal-title"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333333",
            textAlign: "left", // Align to the left
          }}
        >
          Confirm Action
        </Typography>
        <Typography
          id="modal-description"
          sx={{
            mb: 3,
            fontSize: "18px",
            color: "#555555",
            lineHeight: 1.6,
            textAlign: "left", // Align to the left
          }}
        >
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onCancel} color="#666666">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              color: "white",
              backgroundColor: "#333333",
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertConfirm;
