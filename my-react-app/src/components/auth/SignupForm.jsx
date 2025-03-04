import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Container, Box, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { validateFname, validateLname, validateEmail, validatePass, validateFieldsReq } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import OtpFormModal from './OtpForm';

const SignUpForm = () => {
    const navigate = useNavigate();

    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const { firstName, lastName, email, password, confirmPassword } = formData;

    useEffect(() => {
        if (otpVerified) {
            finalSubmit();
        }
    }, [otpVerified]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const fieldReqErrors = validateFieldsReq(formData);
        if (fieldReqErrors) {
            setErrors(fieldReqErrors);
            return false;
        }

        const newErrors = {};
        newErrors.firstName = validateFname(formData.firstName);
        newErrors.lastName = validateLname(formData.lastName);
        newErrors.email = validateEmail(formData.email);
        newErrors.password = validatePass(formData.password);

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        } else {
            newErrors.confirmPassword = '';
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => !error);
    };


    const finalSubmit = async () => {
        if (!otpVerified) {
            setOtpModalOpen(true);
            return;
        }

        try {
            const response = await axiosInstance.post('/user/signup', formData);
            showSuccessToast(response?.data?.message);

            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            showErrorToast(error.response?.data?.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const checkuser = await axiosInstance.post('/user/checkUser', { email });

            if (checkuser?.data?.message === 'User not found. Proceed to signup.') {
                setOtpModalOpen(true);
                return;
            } else {
                showErrorToast(checkuser.data?.message);
                return;
            }
        } catch (error) {
            setOtpModalOpen(false);
            console.log(error?.response?.data?.message || 'An error occurred. Please try again later.');
            return;
        }
    };

    return (
        <Container maxWidth="sm">
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
                    Signup
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="First Name"
                                name="firstName"
                                value={firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Last Name"
                                name="lastName"
                                value={lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="ConfirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                        background: "linear-gradient(45deg, #ff0080, #ff8c00, #ff0080)",
                                        zIndex: -1,
                                        borderRadius: "12px",
                                        boxShadow: "0 0 15px rgba(255, 0, 128, 0.7), 0 0 20px rgba(255, 140, 0, 0.7)",
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
                                Signup
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Typography variant="body2" mt={2}>
                    Already have an account?{' '}
                    <Button onClick={() => navigate('/login')} color="primary">
                        Login
                    </Button>
                </Typography>

                <OtpFormModal
                    open={otpModalOpen}
                    onClose={() => setOtpModalOpen(false)}
                    setOtpVerified={setOtpVerified}
                    email={email}
                    isSignup={true}
                />
            </Box>
        </Container>
    );
};

export default SignUpForm;