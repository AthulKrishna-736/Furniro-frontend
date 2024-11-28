import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { validateCategoryDescription, validateCategoryName } from '../../utils/validation';
import { toast } from 'react-toastify';

const CategoryForm = ({ categories, setCategories, categoryToEdit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Populate form for editing
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [categoryToEdit]);

  // Add or edit category
  const handleSubmit = async(e) => {
    e.preventDefault();

    const nameError = validateCategoryName(name)
    const descriptionError = validateCategoryDescription(description)

    if(nameError || descriptionError){
        setErrors({ name: nameError, description: descriptionError });
        return;
    }
    try {
        if(categoryToEdit){
            console.log('updating category')
            const response = await axiosInstance.patch(`/admin/updateCategory/${categoryToEdit._id}`,{ name, description })
            console.log('category updated: ', response.data.category);

            setCategories((prev) => 
              prev.map((category) =>
                category._id === categoryToEdit._id ? { ...category, name, description } : category
              )
            );
            toast.success(response?.data?.message)
            onClose();

        }else{
            console.log('adding cateogory')
            const response = await axiosInstance.post('/admin/addCategory', { name, description })
            setCategories((prev) => [...prev, response.data.category]);
            toast.success(response?.data?.message)
            onClose();
        }
    } catch (error) {
      toast.error(error?.response?.data?.message)
        console.log('error while adding category: ', error?.response?.data?.message);''
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Category Name"
        variant="outlined"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((prev) => ({ ...prev, name: '' })); // Clear error on change
        }}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        variant="outlined"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setErrors((prev) => ({ ...prev, description: '' })); // Clear error on change
        }}
        error={!!errors.description}
        helperText={errors.description}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {categoryToEdit ? 'Update Category' : 'Add Category'}
        </Button>
        <Button type="button" variant="outlined" color="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default CategoryForm;
