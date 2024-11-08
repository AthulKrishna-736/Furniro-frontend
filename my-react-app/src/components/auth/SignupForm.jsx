import React, { useState } from 'react'
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance'
import { validateFname, validateLname, validateEmail, validatePass, validateFieldsReq } from '../../utils/validation'
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';


const SignUpForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
    })
    const [generalError, setGeneralErrors] = useState('')
    const [errors, setErrors] = useState({});
    const { firstName, lastName, email, password } = formData

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });

        if(generalError){ setGeneralErrors('') } //clears general errors while event change

        if(errors[e.target.name]){
            setErrors((prevErrors)=>({
                ...prevErrors,
                [e.target.name] : '',
            }));
        }
    }

    const validateForm = ()=>{
        //general error check
        const fieldReqError = validateFieldsReq(formData);
        
        if(fieldReqError){
            setGeneralErrors(fieldReqError.message);
            return false;
        }else{
            setGeneralErrors('');
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

        if(!validateForm()) return; //stop if form is invalid

        try {
            const response = await axiosInstance.post('/user/signup',formData);
            showSuccessToast(response.data.message)
            setFormData({
                firstName:'',
                lastName:'',
                email:'',
                password:'',
            })
        } catch (error) {
            showErrorToast(error?.response?.data?.message || 'An error occured. PLease try again later.')
        }
    }

    
  return (
    <Container maxWidth="xs">
    <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
            Signup
        </Typography>
        {generalError && (
            <Typography variant='body2' color='error' gutterBottom>
                {generalError}
            </Typography>
        )}
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Signup
            </Button>
        </form>

        <Typography variant="body2" mt={2}>
                Already have an account?{' '}
            <Button onClick={() => navigate('/login')} color="primary">
                Login
            </Button>
        </Typography>
    </Box>
</Container>
  )
}

export default SignUpForm;