import React, { useState } from "react";
import { Dialog, DialogContent, Button, Box, Typography } from "@mui/material";

const GoogleLogin = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGoogleLogin = async () => {
    try {
      // Initiate Google login by opening a popup window
      const popup = window.open(
        "http://localhost:5000/user/google-login", // Replace with your actual API URL
        "GoogleLogin",
        "width=500,height=600,top=100,left=500"
      );

      // Wait for the popup to close (use a polling mechanism if needed)
      const interval = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(interval);
          // Assuming the user is redirected and authenticated successfully
          handleClose();
        }
      }, 500);
    } catch (error) {
      console.error("Error during Google login:", error);
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Login with Google
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box textAlign="center" p={3}>
            <Typography variant="h6" gutterBottom>
              Login with Google
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoogleLogin}
              sx={{ mt: 2 }}
            >
              Proceed to Google Login
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleLogin;
