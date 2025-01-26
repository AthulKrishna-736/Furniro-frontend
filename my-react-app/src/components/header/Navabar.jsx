import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  FavoriteBorder,
  ShoppingBagOutlined,
  PersonOutline,
  Logout,
  Menu as MenuIcon,

} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/features/userAuth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [logStatus, setLogStatus] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getButtonStyle = (path) => ({
    color: location.pathname === path ? "#5c6bc0" : "black", // Active link style
    borderBottom: location.pathname === path ? "2px solid #5c6bc0" : "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
    paddingBottom: "4px",
  });

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout", {}, { withCredentials: true });
      localStorage.removeItem("email");
      localStorage.removeItem("userEmail");
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message);
    }
  };

  const checkLogStatus = () => {
    setLogStatus(!!localStorage.getItem("userId"));
  };

  useEffect(() => {
    checkLogStatus();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: scrolled ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
          width: "100%",
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: { xs: "0 8px", md: "0 16px" },
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: "600",
              fontSize: "1.8rem",
              color: "#333",
              letterSpacing: "0.5px",
              padding: "4px",
              transition: "color 0.3s ease",
              "&:hover": { color: "#5c6bc0" },
            }}
          >
            Furniro
          </Typography>

          {/* Centered Navbar Links (Desktop Only) */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              gap: 3,
            }}
          >
            <Button onClick={() => navigate("/home")} sx={getButtonStyle("/home")}>
              Home
            </Button>
            <Button onClick={() => navigate("/products")} sx={getButtonStyle("/products")}>
              Products
            </Button>
            <Button onClick={() => navigate("/about-us")} sx={getButtonStyle("/about-us")}>
              About Us
            </Button>
          </Box>

          {/* Icons and Hamburger Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" sx={{ color: "black" }} onClick={() => navigate("/wishlist")}>
              <FavoriteBorder />
            </IconButton>
            <IconButton color="inherit" sx={{ color: "black" }} onClick={() => navigate("/cart")}>
              <ShoppingBagOutlined />
            </IconButton>
            <IconButton color="inherit" sx={{ color: "black" }} onClick={() => navigate("/account")}>
              <PersonOutline />
            </IconButton>
            {logStatus ? (
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "none",
                  border: "1px solid #5c6bc0",
                  padding: "4px 16px",
                  borderRadius: "4px",
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "none",
                  border: "1px solid #5c6bc0",
                  padding: "4px 16px",
                  borderRadius: "4px",
                }}
              >
                Login
              </Button>
            )}
            {/* Hamburger Menu Icon */}
            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile and Tablet View */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 250, padding: "16px" }} role="presentation">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Typography variant="h6">Furniro</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/home");
                  setIsDrawerOpen(false);
                }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/products");
                  setIsDrawerOpen(false);
                }}
              >
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/about-us");
                  setIsDrawerOpen(false);
                }}
              >
                <ListItemText primary="About Us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  logStatus ? handleLogout() : navigate("/login");
                  setIsDrawerOpen(false);
                }}
              >
                <ListItemText primary={logStatus ? "Logout" : "Login"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

    </>
  );
};

export default Navbar;
