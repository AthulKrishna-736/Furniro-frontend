import React, { useEffect, useState } from 'react'
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance'
import { validateFname, validateLname, validateEmail, validatePass, validateFieldsReq } from '../../utils/validation'
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import OtpFormModal from './OtpForm';


const SignUpForm = () => {
    const navigate = useNavigate();

    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [formData, setFormData] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
    })
    const [errors, setErrors] = useState({});
    const { firstName, lastName, email, password } = formData


    useEffect(()=>{
        if(otpVerified){
            finalSubmit();
        }
    },[otpVerified]);

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });

        if(errors[e.target.name]){
            setErrors((prevErrors)=>({
                ...prevErrors,
                [e.target.name] : '',
            }));
        }
    }

    const validateForm = ()=>{
        // Check for required fields
        const fieldReqErrors = validateFieldsReq(formData);
        if (fieldReqErrors) {
            setErrors(fieldReqErrors);
            return false;
        }

        //specific field error check
        const newErrors = {}
        newErrors.firstName = validateFname(firstName);
        newErrors.lastName = validateLname(lastName);
        newErrors.email = validateEmail(email);
        newErrors.password = validatePass(password);
        setErrors(newErrors); //set all errors through validation

        //check if all fields are valid
        return Object.values(newErrors).every((error) => !error);
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(!validateForm()) return; 

        //user check before signup 
        try {
            const checkuser = await axiosInstance.post('/user/checkUser', { email })
            console.log('check user signup = ', checkuser)

            if(checkuser?.data?.message == 'user not found. Proceed to signin'){
                setOtpModalOpen(true);
                return;
            }else{
                console.log('User already exists. Please login')
                return;
            }
        }catch(error){
            setOtpModalOpen(false);
            console.log(error?.response?.data?.message || 'An error occurred. Please try again later.');
            return;
        }

    }
    
    const finalSubmit = async () => {

        if (!otpVerified) {
            setOtpModalOpen(true);
            console.log('Please verify the OTP before signing up.');
            return;
          }

        try {
            const response = await axiosInstance.post('/user/signup', formData);
            console.log('signup res = ', response);
            showSuccessToast(response?.data?.message);

            setTimeout(()=> navigate('/login'),1000);

        } catch (error) {
            console.log('error while signing up user', error); 
            showErrorToast(error.response?.data?.message);
        }
    }
    
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
        Signup
        </Typography>

        <form onSubmit={handleSubmit}>
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
                type="password"
                value={password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
            />
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
                Signup
            </Button>
        </form>

        <Typography variant="body2" mt={2}>
                Already have an account?{' '}
            <Button onClick={() => navigate('/login')} color="primary">
                Login
            </Button>
        </Typography>

      {/* OTP Modal */}
      <OtpFormModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        setOtpVerified={setOtpVerified}
        email={email}
        isSignup={true}
      />

    </Box>
</Container>
  )
}

export default SignUpForm;