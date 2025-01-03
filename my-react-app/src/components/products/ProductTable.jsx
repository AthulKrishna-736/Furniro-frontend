import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import ConfirmationAlert from '../customAlert/Alertmsg'
import ProductForm from './ProductForm'; 
import { toast } from 'react-toastify';

const ProductTable = ({ categories }) => {
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [productToBlock, setProductToBlock] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 4;
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProduct = products.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    //fetch products
    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/admin/getProducts');
            setProducts(response.data?.products || []); 
            console.log(response.data?.products)
        } catch (error) {
            toast.error(error.response?.data?.message)
            console.log('Error fetching products:', error.response?.data || error.message);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    //block product
    const handleBlockProduct = async(id)=>{
        console.log('check product id block = ', id);
        try {
            const response = await axiosInstance.patch(`/admin/blockProduct/${id}`)
            console.log('res from block product = ', response.data)
            
            toast.success(response?.data?.message);

            setProducts((prevProducts)=>
            prevProducts.map((product)=>
            product._id == id ? { ...product, isBlocked: response?.data?.isBlocked } : product))
            
        } catch (error) {
            console.log('error while blocking the product')
            toast.error(error.response?.data?.message)
        }
    }

    //edit product
    const handleEdit = async(product)=>{
        setProductToEdit(product);
        setOpenModal(true);
    }

    // Handlers
    const handleAddProduct = () => {
        setProductToEdit(null);
        setOpenModal(true)
    };
    const handleCloseModal = () => setOpenModal(false);

        // Open confirmation alert
        const confirmBlock = (productId) => {
            setProductToBlock(productId);
            setAlertOpen(true);
        };
    
        // Close confirmation alert
        const closeAlert = () => {
            setAlertOpen(false);
            setProductToBlock(null);
        };
    
        // Handle confirmation
        const handleConfirmBlock = () => {
            if (productToBlock) {
                handleBlockProduct(productToBlock);
            }
            closeAlert();
        };
    

    return (
        <Box sx={{ padding: 3 }}>
            <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
            <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Stock Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentProduct.length > 0 ? (
                            currentProduct.map((product) => (
                                <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '15px' }}>{product.name}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
                                        ₹{product.salesPrice}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', color: product.stockQuantity < 10 ? 'red' : 'green' }}>
                                        {product.stockQuantity}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '15px' }}>{product.category?.name}</TableCell>
                                    <TableCell
                                        sx={{
                                            textAlign: 'center',
                                            color: product.isBlocked ? 'red' : 'green',
                                        }}
                                    >
                                        {product.isBlocked ? 'Blocked' : 'Active'}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            sx={{ marginRight: 1 }}
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color={product.isBlocked ? 'success' : 'error'}
                                            onClick={() => confirmBlock(product._id)}
                                        >
                                            {product.isBlocked ? 'Unblock' : 'Block'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ color: '#999' }}>
                                    No products available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            {/* Modal for Adding Product */}
            {openModal && (
                <ProductForm 
                categories={categories} 
                openModal={openModal} 
                closeModal={handleCloseModal} 
                fetchProducts={fetchProducts}
                productToEdit={productToEdit} 
                />
            )}
                {/* Reusable Confirmation Alert */}
                <ConfirmationAlert
                open={alertOpen}
                onClose={closeAlert}
                onConfirm={handleConfirmBlock}
                title="Block Confirmation"
                message="Are you sure you want to block/unblock this product?"
            />
        </Box>
    );
};

export default ProductTable;
