import React, { useEffect, useState } from "react";
import Navbar from "../../components/header/Navabar";
import Footer from "../../components/footer/Footer";
import HomeBody from "../../components/footer/HomeBody";
import TrendingProducts from "../../components/products/user/TrendingProducts";
import ProductCardSkeleton from "../../components/products/card/ProductCardSkeleton";
import Banner from "../../components/header/Banner";
import { Divider } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/user/featuredProducts");
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/admin/getBanners')
      setBanner(response?.data?.banner)
    } catch (error) {
      console.log('error while fetching',error)
    }
  }
  
  return (
    <div>
      <Navbar />

      {/* Banner Section */}
      <Banner
        image={banner.length > 0 && banner[0].bannerLocation == 'Home' ? banner[0].image : "Unavailable"}
        text="Choose the Best, Find Your Perfect Piece in Our Store."
      />

      <Divider sx={{ margin: "50px 0" }} />

      {/* Trending Products Section */}
      <TrendingProducts />

      <Divider sx={{ margin: "50px 0" }} />

      <Banner
        image={banner.length > 0 && banner[1].bannerLocation == 'Home' ? banner[Math.floor(Math.random()*(banner.length -1)) + 1].image : 'error while getting banner' }
        hideText
      />

      <Divider sx={{ margin: "50px 0" }} />

      {/* Main Content */}
      {loading ? (
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px",
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
            textAlign: "center",
            color: "red",
            marginTop: "20px",
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

export default LandingPage;
