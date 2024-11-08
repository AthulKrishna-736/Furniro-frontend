import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material'
import { validateEmail, validateFieldsReq, validatePass } from "../../utils/validation";
import axiosInstance from "../../utils/axiosInstance";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });
    const [generalError, setGeneralError] = useState('');
    const  [errors, setErrors] = useState({});
    const { email, password } = formData;
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        if(generalError){ setGeneralError(''); }

        if(errors[e.target.name]){
            setErrors((prevErrors)=>({
                ...prevErrors,
                [e.target.name]: '',
            }));
        }
    }

    const validateForm = ()=>{
        //general errors check
        const fieldReqError = validateFieldsReq(formData)
        if(fieldReqError){
            setGeneralError(fieldReqError.message)
            return false;
        }else{
            setGeneralError('');
        }

        //specific field error check
        const newErrors = {};
        newErrors.email = validateEmail(email);
        newErrors.password = validatePass(password);
        setErrors(newErrors);

        return Object.values(newErrors).every((error)=> !error);
    }


    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(!validateForm()) return; //stops if form is invalid

        try {
            console.log('user data is sent...')
            const response = await axiosInstance.post('/user/login',formData)
            navigate('/otpverify',{
                state: { email: response.data.user.email }
            })
            console.log(response.data)
                    
        } catch (error) {
            setGeneralError(error.response.data.message);
            console.log(error.response.data)
        }
    }

  return (
    <Container maxWidth="xs">
    <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
            Login
        </Typography>
        {generalError && (
            <Typography variant="body2" color="error" gutterBottom>
                {generalError}
            </Typography>
        )}
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
                type="password"
                value={password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
            </Button>
        </form>
        <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
                Don't have an account?{" "}
            <Button onClick={()=> navigate('/signup')} sx={{ textTransform: 'none', padding: 0, color: "#1976d2" }}>
                 Sign Up
            </Button>
            </Typography>
        </Box>
    </Box>
</Container>
  )
}

export default LoginForm;