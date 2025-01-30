import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(()=>{
        const checkToken = async ()=>{
          try {
            const response = await axiosInstance.post('/admin/verifyToken', {}, { withCredentials:true })
    
          } catch (error) {
            console.log('error from admin = ',error.response?.data?.message);
          }
        }
        checkToken()
      },[])
    
      useEffect(() => {
        const adminId = localStorage.getItem('adminId'); 
        if (adminId) {
          navigate('/admin-dashboard'); 
        }
      }, [navigate]);

      return !localStorage.getItem('adminId') ? children : null;
}

export default AuthAdmin;