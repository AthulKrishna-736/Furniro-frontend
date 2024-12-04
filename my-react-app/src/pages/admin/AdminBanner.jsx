import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNav';
import ManageBanner from '../../components/admin/ManageBanner';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerData, setBannerData] = useState({ bannerLocation: '', image: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/admin/getBanners');
      setBanners(response.data.banner);
      toast.success(response?.data?.message || 'Banners fetched successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching banners');
      console.error('Error fetching banners:', error);
    }
  };

  const addBanner = async (manageBannerData) => {
    setIsUploading(true);
    try {
      let imageUrl = manageBannerData.image;

      if (imageUrl.startsWith('data:image')) {
        const imageResponse = await uploadImageToCloudinary(imageUrl);
        imageUrl = imageResponse.secure_url;
      }

      const response = await axiosInstance.post('/admin/addBanners', {
        bannerLocation: manageBannerData.bannerLocation,
        image: imageUrl,
      });

      toast.success(response?.data?.message || 'Banner added successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error(error.response?.data?.message || 'Failed to add banner');
    } finally {
      setIsUploading(false);
    }
  };


  const updateBanner = async (id, image) => {
    console.log('check data in updatae ban',[id, image])
    setIsUploading(true);
    try {
      let imageUrl = image;
  
      if (image.startsWith('data:image')) {
        const imageResponse = await uploadImageToCloudinary(image);
        imageUrl = imageResponse.secure_url;
        console.log('imgurl  - ', imageUrl)
      }
  
      const response = await axiosInstance.patch(`/admin/editBanners/${id}`, {
        image: imageUrl,
      });
  
      toast.success(response?.data?.message || 'Banner updated successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error(error.response?.data?.message || 'Failed to update banner');
    } finally {
      setIsUploading(false);
    }
  };  


  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'Furniro_Images');
    formData.append('cloud_name', 'dfjcrliwt');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dfjcrliwt/image/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      toast.error('Failed to upload image to Cloudinary');
      return {};
    }
  };

  return (
    <Container>
      <AdminNavbar />
      <Box display="flex" sx={{ height: '100vh' }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            height: '100vh',
            marginLeft: '210px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ManageBanner
            banners={banners}
            bannerData={bannerData}
            setBannerData={setBannerData}
            onAddBanner={addBanner}
            onUpdateBanner={updateBanner}
            isUploading={isUploading}
          />
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default AdminBanner;
