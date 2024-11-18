import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, InputAdornment, IconButton, Divider } from '@mui/material'
import { setUserId } from "../../redux/features/userAuth";
import { validateEmail, validatePass } from "../../utils/validation";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { showErrorToast } from "../../utils/toastUtils";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';


const LoginForm = () => {
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

        if (!validateForm()) return; //stops if form is invalid

        try {
            console.log('user data is sent...')
            const response = await axiosInstance.post('/user/login', formData)

            console.log(response.data.user.id)
            const userId = localStorage.setItem('userId', response.data.user.id);
            dispatch(setUserId(userId))
            navigate('/home')
            console.log(response.data)

        } catch (error) {
            showErrorToast(error.response.data.message)
            console.log(error.response.data)
        }
    }

    const handleGoogleLogin = () => {
        // Handle Google login here
        console.log('Google login button clicked');
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Login
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Don't have an account?{" "}
                        <Button onClick={() => navigate('/signup')} sx={{ textTransform: 'none', padding: 0, color: "#1976d2" }}>
                            Sign Up
                        </Button>
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Divider sx={{ my: 2 }}><Typography variant="body2">OR</Typography></Divider>

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#4285F4',
                            color: '#4285F4',
                            '&:hover': {
                                borderColor: '#4285F4',
                                backgroundColor: '#4285F4',
                                color: 'white',
                            },
                        }}
                        onClick={handleGoogleLogin}
                    >
                        <GoogleIcon sx={{ mr: 1 }} />
                        Login with Google
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginForm;