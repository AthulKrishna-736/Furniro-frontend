import React, { useState, useEffect, useRef } from 'react';
import { Slider, Box, CircularProgress, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, InputAdornment, Modal, FormHelperText } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import AvatarEditor from 'react-avatar-editor';
import { validateProductName, validateProductDescription, validatePrice, validateStockQuantity } from '../../utils/validation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

const ProductForm = ({ categories, openModal, closeModal, productToEdit, fetchProducts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const cropperRef = useRef();
  const [cropPreviews, setCropPreviews] = useState([])
  const [scale, setScale] = useState(1.2);
  const [localImages, setLocalImages] = useState([null, null, null, null]);
  const [cloudinaryImages, setCloudinaryImages] = useState([null, null, null, null]);
  const [cropModal, setCropModal] = useState({ open:false, index:null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    salesPrice: '',
    stockQuantity: '',
    images: [],
  });

  //reset form 
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
  
  useEffect(() => {
    return () => {
      localImages.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [localImages]);
  
  
  //form inputs changes here
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };


// Handle image upload and add to localImages
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

  const reader = new FileReader();
  reader.onload = () => {
    // Add the uploaded image (original base64) to localImages
    setLocalImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = reader.result; // Base64 image
      return updatedImages;
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`image_${index}`]: "", // Clear error
    }));

    console.log(`Image ${index} uploaded and added to localImages.`);
  };

  reader.readAsDataURL(file);
};

//handle cropping image
const handleCrop = (index) => {
  if (cropperRef.current) {
    const canvas = cropperRef.current.getImageScaledToCanvas();
    const croppedPreview = canvas.toDataURL("image/png");
    canvas.toBlob(
      (blob) => {
        const croppedFile = new File([blob], `cropped-image-${index}.png`, {
          type: "image/png",
        });

        setLocalImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index] = croppedFile; 
          return updatedImages;
        });

        setCropPreviews((prevPreviews) => {
          const updatedPreviews = [...prevPreviews];
          updatedPreviews[index] = croppedPreview; // Save preview for display
          return updatedPreviews;
        });

        setCropModal({ open: false, index: null }); 
        console.log(`Image cropped for index: ${index}`);
      },
      "image/png",
      1
    );
  }
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

  const uploadImages = async (localImages, cropPreviews, cloudinaryImages) => {
    console.log("Starting image upload...");
    
    // Combine cropped and uncropped images dynamically
    const imagesToUpload = localImages.map((image, index) => {
      if (cropPreviews[index]) {
        return cropPreviews[index]; // Use cropped preview if available
      }
      return image; // Use original image otherwise
    });
  
    console.log("Images prepared for upload:", imagesToUpload);
  
    const uploadPromises = imagesToUpload.map((image, index) => {
      if (image instanceof File || typeof image === "string") {
        // If it's a File or base64 string (newly uploaded), upload to Cloudinary
        if (image instanceof File) {
          console.log(`Uploading local image at index ${index}...`);
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          imageFormData.append("upload_preset", "Furniro_Images");
          imageFormData.append("cloud_name", "dfjcrliwt");
          return axios.post(
            "https://api.cloudinary.com/v1_1/dfjcrliwt/image/upload",
            imageFormData
          );
        } else {
          console.log(`Uploading base64 image at index ${index}...`);
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          imageFormData.append("upload_preset", "Furniro_Images");
          imageFormData.append("cloud_name", "dfjcrliwt");
          return axios.post(
            "https://api.cloudinary.com/v1_1/dfjcrliwt/image/upload",
            imageFormData
          );
        }
      }
      // If the image is already a Cloudinary URL, skip re-upload
      console.log(`Retaining existing Cloudinary image at index ${index}:`, cloudinaryImages[index]);
      return Promise.resolve({ data: { secure_url: cloudinaryImages[index] } });
    });
  
    console.log("Awaiting image uploads...");
    const uploadResults = await Promise.all(uploadPromises);
    console.log("All image uploads completed:", uploadResults);
  
    // Extract Cloudinary URLs from responses
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

    const uploadedImageUrls = await uploadImages(localImages, cropPreviews, cloudinaryImages);

    const finalData = {
      ...formData,
      images: uploadedImageUrls,
    };

    if (productToEdit) {
      // Edit product
      const response = await axiosInstance.put(`/admin/updateProduct/${productToEdit._id}`, finalData);
      showSuccessToast(response.data.message);
    } else {
      // Add new product
      const response = await axiosInstance.post('/admin/addProducts', finalData);
      showSuccessToast(response.data.message);
    }

    await fetchProducts();
    resetFormData();
    closeModal();

  } catch (error) {
    showErrorToast(error.response?.data?.message || "Error adding/updating product");
    console.error("Error during submission:", error);
  } finally {
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
                  position: "relative",
                  width: "120px",
                  height: "120px",
                  border: "1px dashed #ccc",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                  backgroundColor: "#f5f5f5",
                  overflow: "visible",
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                {cropPreviews[index] ? (
                  // Show cropped preview
                  <>
                    <img
                      src={cropPreviews[index]}
                      alt={`Cropped Preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        const updatedCropPreviews = [...cropPreviews];
                        updatedCropPreviews[index] = null;
                        setCropPreviews(updatedCropPreviews);
                      }}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                        color: "#fff",
                        minWidth: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </Button>
                  </>
                ) : localImages[index] ? (
                  // Show local image preview (not cropped)
                  <>
                    <img
                      src={
                        localImages[index] instanceof File
                          ? URL.createObjectURL(localImages[index])
                          : localImages[index]
                      }
                      alt={`Local Preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          const updatedLocalImages = [...localImages];
                          updatedLocalImages[index] = null;
                          setLocalImages(updatedLocalImages);
                        }}
                        sx={{
                          backgroundColor: "rgba(255, 0, 0, 0.7)",
                          color: "#fff",
                          minWidth: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          if (localImages[index]) {
                            setTimeout(() => setCropModal({ open: true, index }), 100);
                          } else {
                            console.error(
                              "Cannot open crop modal: No image available at index",
                              index
                            );
                          }
                        }}
                        sx={{
                          backgroundColor: "rgba(0, 123, 255, 0.7)",
                          color: "#fff",
                          minWidth: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        ✂️
                      </Button>
                    </Box>
                  </>
                ) : cloudinaryImages[index] ? (
                  // Show Cloudinary image preview
                  <>
                    <img
                      src={cloudinaryImages[index]}
                      alt={`Cloudinary Image ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                        color: "#fff",
                        minWidth: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
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
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Upload
                    </Typography>
                  </>
                )}

                {errors[`image_${index}`] && (
                  <FormHelperText
                    sx={{
                      position: "absolute",
                      bottom: -20,
                      color: "error.main",
                      fontSize: "12px",
                    }}
                  >
                    {errors[`image_${index}`]}
                  </FormHelperText>
                )}
              </Box>
            ))}

          {/* Crop Modal */}
          <Modal
            open={cropModal.open}
            onClose={() => setCropModal({ open: false, index: null })}
            aria-labelledby="crop-image-modal"
            aria-describedby="crop-image-modal-description"
          >
            <Box
              sx={{
                width: "80%",
                maxWidth: "600px", // Adjust width as needed
                margin: "50px auto",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: 2,
                boxShadow: 24,
                display: "flex", // Flex layout for side-by-side
                alignItems: "center", // Align items vertically centered
                justifyContent: "space-between", // Space out the image and the slider
              }}
            >
              <Box sx={{ width: "70%", maxWidth: "300px", position: "relative" }}>
                <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
                  Crop Image
                </Typography>
                {cropModal.index !== null && localImages[cropModal.index] ? (
                  <AvatarEditor
                    ref={cropperRef}
                    image={localImages[cropModal.index]}
                    width={250}
                    height={250}
                    border={50}
                    borderRadius={0} // Square shape
                    scale={scale} // Dynamic scale
                  />
                ) : (
                  <Typography>No image available</Typography>
                )}
              </Box>

              {/* Vertical Scale Slider */}
              <Box sx={{ width: "20%", height: "250px", display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ marginBottom: 1, textAlign: "center" }}>
                  Zoom
                </Typography>
                <Slider
                  value={scale}
                  onChange={(e, newValue) => setScale(newValue)}
                  min={1}
                  max={2}
                  step={0.1}
                  valueLabelDisplay="auto"
                  orientation="vertical" // Set the slider to be vertical
                  sx={{
                    height: "200px", // Slider height
                    alignSelf: "center", // Center align the slider
                  }}
                />
              </Box>

              {/* Bottom Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2, gap: 1 }}>
                <Button
                  onClick={() => setCropModal({ open: false, index: null })}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCrop(cropModal.index)}
                  variant="contained"
                  color="primary"
                >
                  Crop
                </Button>
              </Box>
            </Box>
          </Modal>
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
              productToEdit ? "Update Product" : "Add Product"
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
