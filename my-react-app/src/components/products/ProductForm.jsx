import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, InputAdornment, Modal, FormHelperText } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { validateProductName, validateProductDescription, validatePrice, validateStockQuantity } from '../../utils/validation';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductForm = ({ categories, openModal, closeModal, productToEdit, fetchProducts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [localImages, setLocalImages] = useState([null, null, null, null]);
  const [cloudinaryImages, setCloudinaryImages] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    salesPrice: '',
    stockQuantity: '',
    images: [],
  });

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      salesPrice: '',
      stockQuantity: '',
      images: [],
    });
    setErrors({});
    setLocalImages([null, null, null, null]);
    setCloudinaryImages([null, null, null, null]);
  };
  

  useEffect(() => {
      if (productToEdit) {
        setCloudinaryImages(productToEdit.images || []);
        setLocalImages([null, null, null, null]);
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          category: productToEdit.category._id,
          salesPrice: productToEdit.salesPrice,
          stockQuantity: productToEdit.stockQuantity,
        });
      } else {
        resetFormData(); 
      }
  }, [openModal, productToEdit]);
  
  
  //form inputs changes here
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };


  //image handling while uploading local
  const handleImageUpload = (e, index) => {
    const file = e.target.files?.[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`image_${index}`]: "Image is required.",
      }));
      return;
    }
  
    if (!validTypes.includes(file?.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`image_${index}`]: "Invalid file type. Only JPG, PNG, WEBP are allowed.",
      }));
      return;
    }

    setLocalImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = file;
      return updatedImages;
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`image_${index}`]: "", 
    }));

    console.log(`Image ${index} selected locally`, file);
  };
  

  //validation process
  const validateForm = () => {
    const newErrors = {
      name: validateProductName(formData.name),
      description: validateProductDescription(formData.description),
      salesPrice: validatePrice(formData.salesPrice),
      stockQuantity: validateStockQuantity(formData.stockQuantity),
      category: formData.category ? "" : "Category is required.",
    };

  // Check for each image field
  localImages.forEach((image, index) => {
    // Validate both local images and Cloudinary URLs
    const isImageMissing = !image && (!cloudinaryImages[index] || cloudinaryImages[index] === "");
    if (isImageMissing) {
      newErrors[`image_${index}`] = "Image is required.";
    }
  });
    
    setErrors(newErrors);
    console.log('errors',newErrors)
    return Object.values(newErrors).every((error) => !error);
  };

  const uploadImages = async (localImages, cloudinaryImages) => {
    console.log("Starting image upload...");
    console.log("Local images:", localImages);
    console.log("Existing Cloudinary images:", cloudinaryImages);

    const uploadPromises = localImages.map((file, index) => {
      if (file) {
        console.log(`Uploading local image at index ${index}...`);
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", "Furniro_Images");
        imageFormData.append("cloud_name", "dfjcrliwt");
  
        return axios.post(
          "https://api.cloudinary.com/v1_1/dfjcrliwt/image/upload",
          imageFormData
        );
      }
      // Keep existing cloudinary image URL if no local file
      console.log(`No new image at index ${index}, retaining Cloudinary image:`, cloudinaryImages[index]);
      return Promise.resolve({ data: { secure_url: cloudinaryImages[index] } });
    });
  
    console.log("Awaiting image uploads...");
    const uploadResults = await Promise.all(uploadPromises);
    console.log("All image uploads completed:", uploadResults);

    const secureUrls = uploadResults.map((res) => res.data.secure_url);

    console.log("Final secure URLs:", secureUrls);

  return secureUrls;
  };  


  //handle submitting
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate the form first
  if (!validateForm()) return;

  try {
    setIsLoading(true);

    const uploadedImageUrls = await uploadImages(localImages, cloudinaryImages);

    const finalData = {
      ...formData,
      images: uploadedImageUrls,
    };

    if (productToEdit) {
      // Edit product
      const response = await axiosInstance.put(`/admin/updateProduct/${productToEdit._id}`, finalData);
      console.log('Product updated successfully:', response.data.message);
    } else {
      // Add new product
      const response = await axiosInstance.post('/admin/addProducts', finalData);
      console.log('Product added successfully:', response.data.message);
    }

    await fetchProducts();
    resetFormData();
    closeModal();

    // Notify success
    toast.success("Product added/updated successfully!");
  } catch (error) {
    // Log and show error message
    toast.error(
      error.response?.data?.message || "Error adding/updating product"
    );
    console.error("Error during submission:", error);
  } finally {
    // Reset loading state
    setIsLoading(false);
  }
};

  
  
  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box sx={{
        width: '400px',
        padding: 3,
        backgroundColor: '#fff',
        margin: 'auto',
        marginTop: '100px',
        boxShadow: 3,
        borderRadius: 2,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>Add New Product</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name || ''}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Product Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description || ''}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.category}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.1, marginBottom: 2 }}>
            {[...Array(4)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px',
                  backgroundColor: '#f5f5f5',
                  overflow: 'visible',
                  cursor: 'pointer',
                  "&:hover": { borderColor: 'primary.main' },
                }}
              >

                {localImages[index] ? (
                  // Show preview of the locally uploaded image
                  <>
                    <img
                      src={URL.createObjectURL(localImages[index])}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        const updatedLocalImages = [...localImages];
                        updatedLocalImages[index] = null;
                        setLocalImages(updatedLocalImages);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                        color: '#fff',
                        minWidth: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </Button>
                  </>
                ) : cloudinaryImages[index] ? (
                  // Show cloudinary image if present
                  <>
                    <img
                      src={cloudinaryImages[index]}
                      alt={`Cloudinary ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        const updatedCloudinaryImages = [...cloudinaryImages];
                        updatedCloudinaryImages[index] = null;
                        setCloudinaryImages(updatedCloudinaryImages);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                        color: '#fff',
                        minWidth: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </Button>
                  </>
                ) : (
                  // Show upload input for new image
                  <>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp"
                      onChange={(e) => handleImageUpload(e, index)}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Upload
                    </Typography>
                  </>
                )}

                {errors[`image_${index}`] && (
                  <FormHelperText
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      color: 'error.main',
                      fontSize: '12px',
                    }}
                  >
                    {errors[`image_${index}`]}
                  </FormHelperText>
                )}
              </Box>
            ))}
          </Box>

          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity || ''}
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{ startAdornment: <InputAdornment position="start">#</InputAdornment> }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Sales Price"
            name="salesPrice"
            value={formData.salesPrice}
            onChange={handleChange}
            error={!!errors.salesPrice}
            helperText={errors.salesPrice || ''}
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} /> // Loading spinner
            ) : (
              "Add Product"
            )}
          </Button>
          <Button type="button" variant="outlined" color="secondary" fullWidth sx={{ marginTop: 2 }} onClick={closeModal}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ProductForm;
