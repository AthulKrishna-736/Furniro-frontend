import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/sidebar/AdminSidebar';
import ProductForm from '../../components/products/ProductForm';
import AdminNavbar from '../../components/header/AdminNav';
import ProductTable from '../../components/products/ProductTable';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast } from '../../utils/toastUtils';

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/getCategories');
      setCategories(response.data?.categories);
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Error fetching categories');
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    console.log('Updated categories:', categories);
    fetchCategories();
  }, []); 

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer autoClose={1000}/>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, marginLeft: '250px', padding: 3 }}>
        <AdminNavbar />
        <Container maxWidth="lg">
          <ProductTable categories={categories} />

          {isFormOpen && (
            <ProductForm
              categories={categories}
              openModal={isFormOpen}
              closeModal={() => setIsFormOpen(false)}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ProductPage;
