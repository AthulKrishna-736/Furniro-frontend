import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import UserSidebar from '../../../components/user/userprofile/UserSidebar';
import Navbar from '../../../components/header/Navabar';
import { setUserDetails } from '../../../redux/features/userAuth';
import axiosInstance from '../../../utils/axiosInstance';
import ProfileDetails from '../../../components/user/userprofile/ProfileDetails';


const UserAccountPage = () => {
  const dispatch = useDispatch();

  const userEmail = useSelector((state)=> state.userAuth.userEmail);
  console.log('useremail in useraccountpage: ', userEmail);

  useEffect(()=>{
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.post('/user/getUserDetail', { email: userEmail });
        console.log('res data: ', response?.data?.user)
        dispatch(setUserDetails(response?.data?.user));
      } catch (error) {
        console.log('error userdetail: ',error);
        toast.error(error.response?.data?.message);
      }
    }
    getUserDetails();
  },[])


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ToastContainer/>
      {/* Navbar */}
      <Navbar />

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <UserSidebar />

        {/* Profile Details Section */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '20px',
            background: '#f9f9f9',
            overflowY: 'hidden',
          }}
        >
          <ProfileDetails />
        </Box>
      </Box>
    </Box>
  );
};

export default UserAccountPage;
