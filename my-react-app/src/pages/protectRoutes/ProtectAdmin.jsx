import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectAdmin = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const checkToken = async ()=>{
            try {
              console.log('token req gone to backend admin')
              const response = await axiosInstance.post('/admin/verifyToken', {}, { withCredentials:true })
              console.log('Token verification success: ', response.data);
      
            } catch (error) {
              console.log(error.response.data.message);
            }
          }
          checkToken() 
    },[])

    useEffect(() => {
        const adminId = localStorage.getItem('adminId'); // Get userId from localStorage
        if (!adminId) {
          console.log('User is not authenticated. Redirecting to /admin-login...');
          navigate('/admin-login'); // Redirect to login if no userId is found in localStorage
        }
      }, [navigate]);
      
      return localStorage.getItem('adminId') ? children : null;
}

export default ProtectAdmin;