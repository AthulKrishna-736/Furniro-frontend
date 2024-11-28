import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Box, Container, Button, Modal } from '@mui/material';
import AdminSidebar from '../../components/admin/AdminSidebar'; // Sidebar
import CategoryTable from '../../components/category/CategoryTable';
import CategoryForm from '../../components/category/CategoryForm';
import AdminNavbar from '../../components/admin/AdminNav';
import axiosInstance from '../../utils/axiosInstance';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/getCategories');
      console.table(response.data?.categories)
      setCategories(response.data?.categories)
    } catch (error) {
      console.error('Error fetching categories: ', error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const blockCategory = async (id) => {
    try {
      console.log('category is getting blocked...')
      const response = await axiosInstance.patch(`/admin/blockCategory/${id}`)
      console.log('blocked category ', response.data)
      toast.success(response?.data?.message)
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, isBlocked: response.data.isBlocked } : cat
        )
      );

    } catch (error) {
      console.error('Error blocking/unblocking category: ', error.response?.data?.message);
    }
  }

  // Open Modal for Add/Edit Category
  const handleOpenModal = (category = null) => {
    setEditCategory(category);
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setEditCategory(null);
    setOpenModal(false);
  };

  return (
      <Box sx={{ display: 'flex' }}>
        <ToastContainer autoClose={1000} />
        
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '250px',
          padding: 3,
        }}
      >
        {/* Admin Navbar */}
        <AdminNavbar />

        <Container maxWidth="lg">
          {/* Add Category Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: 2 }}
            onClick={() => handleOpenModal()}
          >
            Add Category
          </Button>

          {/* Category Table */}
          <CategoryTable
            categories={categories}
            setCategories={setCategories}
            blockCategory={blockCategory}
            handleEdit={handleOpenModal}
          />

          {/* Add/Edit Modal */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{ width: 400, margin: '100px auto', padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
              <CategoryForm
                categories={categories}
                setCategories={setCategories}
                categoryToEdit={editCategory}
                onClose={handleCloseModal}
              />
            </Box>
          </Modal>
        </Container>
      </Box>
    </Box>
  );
};

export default CategoryPage;
