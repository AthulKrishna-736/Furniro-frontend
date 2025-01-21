import React from "react";
import { Box, Typography, CssBaseline } from "@mui/material";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100vh",
        backgroundColor: "#eef2f6",
        padding: 3,
        backgroundImage:
          "radial-gradient(circle at top, #d0e8f2, #eef2f6, #cfe0e8)",
      }}
    >
        <CssBaseline/>
      {/* Image Section */}
      <Box
        component="img"
        src="https://img.freepik.com/free-vector/404-error-concept-illustration_114360-1811.jpg"
        alt="Person looking through telescope"
        sx={{
          width: "350px",
          maxWidth: "90%",
          mb: 3,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
        }}
      />

      {/* Main Message */}
      <Typography
        variant="h3"
        sx={{
          color: "#333",
          fontWeight: "bold",
          mb: 1,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Uh-oh! Lost in Space.
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: "#555",
          mb: 3,
          maxWidth: "500px",
          lineHeight: 1.6,
        }}
      >
        It seems like the page you're looking for has drifted away into the
        unknown. Don’t worry, you can find your way back to the right path!
      </Typography>

      {/* Footer Message */}
      <Typography
        variant="caption"
        sx={{
          color: "#888",
          mt: 5,
          fontStyle: "italic",
        }}
      >
        "Not all who wander are lost, but this page might be..."
      </Typography>
    </Box>
  );
};

export default ErrorPage;
