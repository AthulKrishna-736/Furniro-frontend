import React, { useEffect, useState } from 'react';
import Navbar from '../../components/header/Navabar';
import Footer from '../../components/footer/Footer';
import HomeBody from '../../components/home/HomeBody';
import TrendingProducts from '../../components/products/user/TrendingProducts';
import ProductCardSkeleton from '../../components/products/card/ProductCardSkeleton';
import Banner from '../../components/header/Banner';
import { Divider } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get('/user/featuredProducts');
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Banner Section */}
      <Banner
        image="https://t4.ftcdn.net/jpg/05/08/17/01/360_F_508170187_4Oonk4IG8u9eyfwSUvTASkT8hl71vRX2.jpg"
        text="Choose the Best, Find Your Perfect Piece in Our Store."
      />

      <Divider sx={{ margin: '50px 0' }} />

      {/* Trending Products Section */}
      <TrendingProducts />

      <Divider sx={{ margin: '50px 0' }} />
      
      <Banner
        image="https://i0.wp.com/designertimberfurniture.com.au/wp-content/uploads/2022/05/1505353741Vale1.1.jpg?fit=1200%2C500&ssl=1"
        hideText
      />

      <Divider sx={{ margin: '50px 0' }} />

      {/* Main Content */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Display multiple skeletons while loading */}
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <p
          style={{
            textAlign: 'center',
            color: 'red',
            marginTop: '20px',
          }}
        >
          {error}
        </p>
      ) : (
        <HomeBody products={(products || []).slice(0, 8)} /> 
      )}

      <Footer />
    </div>
  );
};

export default Home;
