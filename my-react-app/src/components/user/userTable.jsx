import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import ConfirmationAlert from '../admin/Alertmsg';


const UserTable = ({ users, onBlockUser }) => {

  const [alertOpen, setAlertOpen] = useState(false); 
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const[currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handlePageChange = (event, value)=>{
    setCurrentPage(value);
  }

  const startIndex = (currentPage - 1)* itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);


  const handleToggleStatus = (id) => {
    setUserIdToBlock(id);
    setAlertOpen(true);
  };

  const handleConfirmBlock = async () => {
    try {
      await onBlockUser(userIdToBlock); 
      setAlertOpen(false); 
    } catch (error) {
      console.error('Failed to update user status:', error.message);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false); 
  }


  return (
    <Box sx={{ padding: 3 }}>
      <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <TableRow key={user._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell sx={{ textAlign: 'center' }}>{user.firstName}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{user.email}</TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    color: user.isBlocked ? 'red' : 'green',
                  }}
                >
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    color={user.isBlocked ? 'success' : 'error'}
                    onClick={() => handleToggleStatus(user._id)}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: '#999' }}>
                No users available.
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length > itemsPerPage &&(
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={Math.ceil(users.length / itemsPerPage)}
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary"
        />
      </Box> 
      )}

        {/* Confirmation Alert */}
        <ConfirmationAlert
        open={alertOpen}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmBlock}
        title="Block/Unblock Confirmation"
        message="Are you sure you want to block/unblock this user?"
      />

    </Box>
  );
};

export default UserTable;
