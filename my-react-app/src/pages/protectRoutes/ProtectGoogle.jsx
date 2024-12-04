import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectGoogle = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true); // Track redirection check

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // If logged in, redirect to /home
      navigate("/home", { replace: true });
    } else if (location.pathname.includes("/oauth")) {
      // Prevent navigating back to OAuth routes if not logged in
      navigate("/login", { replace: true });
    } else {
      // Allow children to render
      setIsChecking(false);
    }
  }, [navigate, location]);

  // Show spinner during the redirection check
  if (isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={70} thickness={5} color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Checking authentication, please wait...
        </Typography>
      </Box>
    );
  }

  // Render children if not logged in
  return <>{children}</>;
};

export default ProtectGoogle;
