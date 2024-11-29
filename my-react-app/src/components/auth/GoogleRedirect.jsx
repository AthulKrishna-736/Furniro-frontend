import React, { useEffect } from 'react'
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../redux/features/userAuth';

const GoogleRedirect = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const userId = searchParams.get('userId')
    console.log('param id = ', userId);
    const email = searchParams.get('email');
    console.log('param email =', email);
    const name = searchParams.get('name');
    console.log('name param = ', name)
    const message = searchParams.get('message')
    console.log('msd param = ',message);
    const error = searchParams.get('error');
    console.log('error param - ', error);

    if(error){
      console.log('Google login failed', error)
      toast('Google login failed. Please try again.')
      navigate('/login')
      return;
    }

    if(userId){
      localStorage.setItem('userId', userId)
      dispatch(setUserId(userId))
      navigate('/home')
    }
  },[searchParams, dispatch, navigate])

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      bgcolor: "background.default", 
    }}
  >
    <CircularProgress size={70} thickness={5} color="primary" />
    <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
      Redirecting to home Please wait...
    </Typography>
  </Box>
  )
}

export default GoogleRedirect;