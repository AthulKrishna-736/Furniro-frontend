import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const GoogleOAuthStart = () => {
  useEffect(() => {
    const initiateGoogleLogin = async () => {
      try {
        const response = await axiosInstance.get("/user/google-login");
        const { url } = response.data;
        console.log("Redirecting to Google login URL:", url);
        window.location.href = url;
      } catch (error) {
        console.error("Error initiating Google login:", error);
        window.location.href = "/login";
      }
    };

    initiateGoogleLogin();
  }, []);

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
        Redirecting to Google login...
      </Typography>
    </Box>
  );
};

export default GoogleOAuthStart;
