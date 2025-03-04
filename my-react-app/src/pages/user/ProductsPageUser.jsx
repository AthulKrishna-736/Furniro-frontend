import React from 'react';
import ProductsUser from '../../components/products/user/ProductsUser'; // Adjust the path as necessary
import Navbar from '../../components/header/Navabar';
import Footer from '../../components/footer/Footer';
import { Divider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const ProductsPageUser = () => {
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />
      <ToastContainer/>

      <Divider sx={{marginTop:'70px'}}/>

      {/* Main Products Section */}
      <ProductsUser />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ProductsPageUser;