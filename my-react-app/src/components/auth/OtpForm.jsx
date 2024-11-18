import React, { useEffect, useState } from 'react'
import { validateOtp } from '../../utils/validation'
import { Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

const OtpForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [otp, setOtp] = useState(['','','','','','']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState('');
    const [canResend, setCanResend] = useState(false);

    const email = location.state?.email;
    console.log(email)

    const startCoundown = (expiryTime)=>{
      const timer = setInterval(()=>{
        const now = new Date();
        const timeleft = Math.floor((new Date(expiryTime) - now)/ 1000);

        if(timeleft > 0){
          const minutes = String(Math.floor(timeleft/60)).padStart(2,'0');
          const seconds = String(timeleft % 60).padStart(2,'0');

          setCountdown(`${minutes}:${seconds}`)
        }else{
          setCountdown('');
          setCanResend(true);
          clearInterval(timer);
        }

      },1000)

      return timer;
    }

    useEffect(()=>{

      if(!email){
        navigate('/login',{ replace:true });
        return;
      }
      setLoading(false);

      axiosInstance.post('/user/otpVerify',{ email })

      .then((response) =>{
        const { otpExpireAt } = response.data
        console.log(otpExpireAt)
        showSuccessToast(response.data.message)
        startCoundown(otpExpireAt);
      })

      .catch((error) =>{
        console.error('Error fetching otp ',error)
      }) 
    },[email, navigate])

    if(loading) return null;
  
    //handle inputchange of otp entering
    const handleChange = (e, index)=>{
        let value = e.target.value
        const error = validateOtp([value]);
        if(error){
          setError('Please enter numbers only');
          return;
        }else{
          setError('');
        }
        if(value.length > 1) return;

        setOtp((prevOtp)=>{
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            return newOtp;
        });
        //move focus when input box filled
        if (value && index < otp.length - 1) {
          document.getElementById(`otp-input-${index + 1}`).focus();
        }
}

    const handleResendOTP = ()=>{
        axiosInstance.post('/user/resendOtp', { email })
        .then((response)=>{
          console.log(response.data)
          showSuccessToast(response.data.message)
          setOtp(['', '', '', '', '', '']);
          const newExpiryTime = new Date();
          newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 2);
          startCoundown(newExpiryTime);
          setCanResend(false);
        })
        .catch((error)=>{
          console.log(error.message)
          showErrorToast(error.response.data.message)
        })
    }

  const handleSubmit = async()=>{
    try {
      const otpString = otp.join('');
      if(otpString.length == 6){

        const response = await axiosInstance.post('/user/otpCheck',{ otpString })
        console.log(response.data.message)
        showSuccessToast(response.data.message)
        //routing to home page
        setTimeout(()=>{
          navigate('/login')
        },1000)

      }else{
          setError('Please enter a valid 6-digit OTP')
      }
    } catch (error) {
      console.log(error.response.data.message)
      showErrorToast(error.response.data.message)
    }
}

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            OTP Verification
          </Typography>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
      </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength="1"
              style={{
                width: '50px',
                height: '50px',
                fontSize: '24px',
                textAlign: 'center',
                borderRadius: '8px',
                border: '2px solid #ddd',
                outline: 'none',
                backgroundColor: '#f9fafb',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                color: '#333',
                fontWeight: 'bold',
              }}
              onFocus={(e) => {
                e.target.select();
                e.target.style.borderColor = '#4a90e2'; // Active border color
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'; // Focus shadow
              }}
              onBlur={(e) => {

                e.target.style.borderColor = '#ddd'; // Reset border color
                e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Reset shadow
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {canResend ? (
              "Didn't receive the code?"
            ) : (
              <>
                Resend OTP in{' '}
                <span style={{ color: 'red', fontWeight: 'normal' }}>
                  {countdown} remaining
                </span>
              </>
            )}
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={handleResendOTP}
            disabled={!canResend}
          >
            Resend OTP
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={handleSubmit}
          >
          Verify OTP
        </Button>
    </Container>
  );
};


export default OtpForm;