import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "../../redux/features/userAuth";
import axiosInstance from "../../utils/axiosInstance";

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('check this google thing is working? ')
    const processGoogleCallback = async () => {
      try {
        const response = await axiosInstance.get("/user/google-callback");
        const { message, user, tokens } = response.data;

        if (response.status === 200 && message === "Google login successful") {
          // Save tokens and user details
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userEmail", user.email);

          // Dispatch Redux action if needed
          dispatch(setUserId(user.id));

          // Redirect to home page
          navigate("/home");
        } else {
          // If not successful, redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error processing Google callback:", error);
        navigate("/login");
      }
    };

    processGoogleCallback();
  }, [dispatch, navigate]);

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      bgcolor: "background.default", // Adjust according to theme
    }}
  >
    <CircularProgress size={70} thickness={5} color="primary" />
    <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
      Redirecting to Google login...
    </Typography>
  </Box>
  );
};

export default GoogleOAuthCallback;
