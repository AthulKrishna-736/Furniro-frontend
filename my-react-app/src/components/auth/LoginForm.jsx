import React, { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, InputAdornment, IconButton, Divider } from '@mui/material'
import { setAdminId, setUserEmail, setUserId } from "../../redux/features/userAuth";
import { validateEmail, validatePass } from "../../utils/validation";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { showErrorToast } from "../../utils/toastUtils";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleAuth from "./GoogleAuth";

const LoginForm = ({ isAdmin = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { email, password } = formData;
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        if (errors[e.target.name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [e.target.name]: '',
            }));
        }
    }

    const validateForm = () => {
        const newErrors = {};
        // Field-specific required checks
        if (!email) {
            newErrors.email = "Email is required";
        } else {
            newErrors.email = validateEmail(email);
        }
        if (!password) {
            newErrors.password = "Password is required";
        } else {
            newErrors.password = validatePass(password);
        }
        setErrors(newErrors);

        return Object.values(newErrors).every((error) => !error);
    }

    const handleClickShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; 

        localStorage.setItem('email',email); 

        try {
            console.log('user data is sent...')
            const apiUrl = isAdmin ?'/admin/login' : '/user/login';
            const response = await axiosInstance.post(apiUrl, formData);

            console.log(response?.data?.user?.id)
            if (isAdmin) {
                const adminId = localStorage.setItem('adminId', response?.data?.user?.id);
                dispatch(setAdminId(adminId)); 
                navigate('/admin-dashboard'); 
            } else {
                const userId = localStorage.setItem('userId', response?.data?.user?.id);
                const userEmail = localStorage.setItem('userEmail', response?.data?.user?.email);
                console.log('local storage in loginform: ',localStorage);
                dispatch(setUserEmail(userEmail));
                dispatch(setUserId(userId));
                navigate('/home'); 
            }
            console.log(response?.data)

        } catch (error) {
            console.log(error.response?.data)
            showErrorToast(error.response?.data?.message)
        }
    }

    const handleGoogleSuccess = ({ userId, name }) => {
        localStorage.setItem("userId", userId);
        dispatch(setUserId(userId));
        navigate("/home");
      };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userId = params.get("userId");
    
        if (token && userId) {
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            dispatch(setUserId(userId));
    
            window.history.replaceState({}, document.title, window.location.pathname);
    
            navigate("/home");
        }
    }, [dispatch, navigate]);

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                
                <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #FF7E5F, #FEB47B)', 
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    mb: 3,
                }}
                >
                    {!isAdmin ? 'Login' : 'Admin Login'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Forgot Password Link */}
                    <Typography
                        variant="body2"
                        sx={{
                        textAlign: "right",
                        color: "primary.main",
                        cursor: "pointer",
                        marginTop: "8px",
                        marginBottom: "16px",
                        }}
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </Typography>

                    {/* Login button */}
                    <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        position: "relative",
                        padding: "12px 20px",
                        background: "#111", 
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderRadius: "10px",
                        textTransform: "uppercase",
                        border: "2px solid transparent",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
                        transition: "all 0.4s ease-in-out",
                        "&:before": {
                        content: '""',
                        position: "absolute",
                        top: "-5px",
                        left: "-5px",
                        right: "-5px",
                        bottom: "-5px",
                        background: "linear-gradient(45deg, #ff0080, #ff8c00, #ff0080)", // Neon colors
                        zIndex: -1,
                        borderRadius: "12px",
                        boxShadow: "0 0 15px rgba(255, 0, 128, 0.7), 0 0 20px rgba(255, 140, 0, 0.7)", // Glowing neon effect
                        opacity: 0,
                        transition: "all 0.3s ease-in-out",
                        },
                        "&:hover": {
                        background: "#333",
                        color: "#00b3ff", 
                        "&:before": {
                            opacity: 1, 
                            transform: "scale(1.1)", 
                        },
                        },
                    }}
                    >
                    Login
                    </Button>
                </form>

            {!isAdmin && (
            <>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                Don't have an account?{" "}
                    <Button
                    onClick={() => navigate('/signup')}
                    sx={{ textTransform: 'none', padding: 0, color: "#1976d2" }}
                    >
                        Sign Up
                    </Button>
                </Typography>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2">OR</Typography>
                </Divider>
                    <GoogleAuth onLoginSuccess={handleGoogleSuccess} />
                </Box>
                </>
            )}
 
            </Box>
        </Container>
    );
}

export default LoginForm;