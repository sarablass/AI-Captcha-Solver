import React from "react";
import { Box, Typography } from "@mui/material";

const WelcomePage = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "#3f51b5",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Welcome to Our Website!
      </Typography>
    </Box>
  );
};

export default WelcomePage;
