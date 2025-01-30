import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminSidebar from '../../components/sidebar/AdminSidebar'; 
import UserTable from '../../components/user/userTable';
import AdminNavbar from '../../components/header/AdminNav';
import axiosInstance from '../../utils/axiosInstance';

const UserListPage = () => {
  const [users, setUsers] = useState([])
  
  const getUsers = async()=>{
      try {
          const response = await axiosInstance.get('/admin/getUsers')
          console.table(response.data?.users)
          setUsers(response.data.users)
      } catch (error) {
          console.log('error while getting users',error)
      }
  }

  useEffect(()=>{
    getUsers();
  },[])

  const blockUser = async (id) => {
    try {
        const response = await axiosInstance.patch(`/admin/blockUser/${id}`)
        toast.success(response?.data?.message)
        setUsers((prev)=>
        prev.map((user)=>
            user._id === id ? { ...user, isBlocked: response.data.isBlocked } : user
        ))
        getUsers();

    } catch (error) {
        console.log('error while blocking user', error.response.data.message);
        toast.error(error.response?.data?.message);
    }
  }

  
  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer autoClose={1000}/>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '250px',  // Adjust this value to match sidebar width
          padding: 3,
        }}
      >
        {/* Admin Navbar */}
        <AdminNavbar />

        {/* User Management Section */}
        <Container maxWidth="lg">
          <Box sx={{ marginBottom: '30px', textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: '2.5rem',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                padding: '10px 0',
                display: 'inline-block',
                transition: 'color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  color: '#1976d2',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              User Management
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                  borderRadius: '2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'width 0.3s ease',
                }}
              />
            </Typography>
          </Box>
          {/* User Table */}
          <UserTable users={users} onBlockUser={blockUser} />
        </Container>

      </Box>
    </Box>
  );
};

export default UserListPage;
