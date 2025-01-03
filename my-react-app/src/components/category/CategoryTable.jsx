import React, { useState } from 'react';
import ConfirmationAlert from '../customAlert/Alertmsg';
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


const CategoryTable = ({ categories, handleEdit, blockCategory }) => {
  const [alertOpen, setAlertOpen] = useState(false); 
  const [categoryIdToBlock, setCategoryIdToBlock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (event , value)=>{
    setCurrentPage(value)
  }


  const handleToggleStatus = (id) => {
    setCategoryIdToBlock(id);
    setAlertOpen(true);
  };

  const handleConfirmBlock = async () => {
    try {
      await blockCategory(categoryIdToBlock); 
      setAlertOpen(false);
    } catch (error) {
      console.error('Failed to update category status:', error.message);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false); 
  };

  return (
    <Box sx={{ padding: 3 }}>
      <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Category Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCategories.length > 0 ? (
              currentCategories.map((category) => (
                <TableRow
                  key={category._id}
                  sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell sx={{ textAlign: 'center' }}>{category.name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{category.description}</TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      color: category.isBlocked ? 'red' : 'green',
                    }}
                  >
                    {category.isBlocked ? 'Blocked' : 'Active'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color={category.isBlocked ? 'success' : 'error'}
                      onClick={() => handleToggleStatus(category._id)}
                    >
                      {category.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#999' }}>
                  No categories available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {categories.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Pagination
          count={Math.ceil(categories.length/itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
          />
        </Box>
      )}

        {/* Confirmation Alert */}
        <ConfirmationAlert
        open={alertOpen}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmBlock}
        title="Block/Unblock Confirmation"
        message="Are you sure you want to block/unblock this category?"
      />
    </Box>
  );
};

export default CategoryTable;
