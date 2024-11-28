import React from 'react';
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
} from '@mui/material';

const CategoryTable = ({ categories, handleEdit, blockCategory }) => {
  const handleToggleStatus = async (id) => {
    try {
      await blockCategory(id);
    } catch (error) {
      console.error('Failed to update category status:', error.message);
    }
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
            {categories.length > 0 ? (
              categories.map((category) => (
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
    </Box>
  );
};

export default CategoryTable;
