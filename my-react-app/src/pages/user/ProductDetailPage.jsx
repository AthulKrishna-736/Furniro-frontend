import React from 'react';
import ProductDetail from '../../components/products/ProductDetail';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/header/Navabar';

const ProductDetailPage = () => {
  return (
    <div>
      <Navbar/> 
      <ProductDetail /> 
      <Footer /> 
    </div>
  );
};

export default ProductDetailPage;
