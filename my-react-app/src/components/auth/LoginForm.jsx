import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, InputAdornment, IconButton, Divider, useMediaQuery } from '@mui/material';
import { setAdminId, setUserEmail, setUserId } from "../../redux/features/userAuth";
import { validateEmail, validatePass } from "../../utils/validation";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { showErrorToast } from "../../utils/toastUtils";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleAuth from "./GoogleAuth";
import { useTheme } from '@mui/material/styles';

const LoginForm = ({ isAdmin = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (errors[e.target.name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [e.target.name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
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
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        localStorage.setItem('email', email);

        try {
            const apiUrl = isAdmin ? '/admin/login' : '/user/login';
            const response = await axiosInstance.post(apiUrl, formData);

            if (isAdmin) {
                const adminId = response?.data?.user?.id;
                localStorage.setItem('adminId', adminId);
                dispatch(setAdminId(adminId));
                navigate('/admin-dashboard');
            } else {
                const userId = response?.data?.user?.id;
                const userEmail = response?.data?.user?.email;
                localStorage.setItem('userId', userId);
                localStorage.setItem('userEmail', userEmail);
                dispatch(setUserEmail(userEmail));
                dispatch(setUserId(userId));
                navigate('/home');
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message);
        }
    };

    const handleGoogleSuccess = ({ userId }) => {
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
        <Container maxWidth="xs" sx={{ padding: isSmallScreen ? 2 : 4 }}>
            <Box sx={{ mt: isSmallScreen ? 4 : 8, textAlign: 'center' }}>
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
                        fontSize: isSmallScreen ? '1.8rem' : '2.5rem',
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

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            padding: "12px 20px",
                            background: "#111",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "16px",
                            borderRadius: "10px",
                            textTransform: "uppercase",
                            border: "2px solid transparent",
                            boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
                            transition: "all 0.4s ease-in-out",
                            "&:hover": {
                                background: "#333",
                                color: "#00b3ff",
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
};

export default LoginForm;
