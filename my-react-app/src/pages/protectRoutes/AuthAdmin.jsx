import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(()=>{
        const checkToken = async ()=>{
          try {
            console.log('token req gone to backend admin route')
            const response = await axiosInstance.post('/admin/verifyToken', {}, { withCredentials:true })
            console.log('Token verification success: ', response?.data);
    
          } catch (error) {
            console.log('error from admin = ',error.response?.data?.message);
          }
        }
        checkToken()
      },[])
    
      useEffect(() => {
        const adminId = localStorage.getItem('adminId'); 
        if (adminId) {
          console.log('admin is authenticated, redirecting to /admin-dashboard...');
          navigate('/admin-dashboard'); 
        }
      }, [navigate]);

      return !localStorage.getItem('adminId') ? children : null;
}

export default AuthAdmin;