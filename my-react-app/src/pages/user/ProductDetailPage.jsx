import React, { useEffect } from 'react';
import ProductDetail from '../../components/products/ProductDetail';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/header/Navabar';
import { ToastContainer } from 'react-toastify';

const ProductDetailPage = () => {
  return (
    <div>
      <Navbar/> 
      <ToastContainer/>
      <ProductDetail /> 
      <Footer /> 
    </div>
  );
};

export default ProductDetailPage;
