import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress, Pagination } from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  HourglassEmpty,
  Download,
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { useNavigate } from 'react-router-dom';
import AlertConfirm from '../customAlert/AlertConfirm';
import OrderProgress from './ProgessBar';
import ExpandedOrder from './ExpandedOrder';

const OrderDetail = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('')
  const [reason, setReason] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const userId = localStorage.getItem('userId');

  const fetchOrderDetails = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/user/getOrder/${userId}?page=${page}`);
      const { orders, pagination } = response.data;
      console.log('check order: ', orders)
      setOrders(orders);
      setPagination(pagination);
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrderDetails();
    } else {
      showErrorToast('User not logged in');
    }
  }, [userId]);

  const updateWallet = async (totalPrice, type, description, orderId) => {
    try {
      const response = await axiosInstance.patch(`/user/updateWallet/${userId}`, {
        amount: totalPrice,
        type,
        description,
        orderId,
      })
      console.log('response of wallet promise: ', response.data)
    } catch (error) {
      console.log('error updating the cart: ', error.response.data?.message)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const cancelledOrder = orders.find((order) => order.orderId === orderId);
      const { totalPrice, payment, status } = cancelledOrder;

      const response = await axiosInstance.patch('/user/cancelOrder', { orderId });
      showSuccessToast(response.data?.message);

      if (payment == 'COD') {
        console.log('cod this worked')
        if (status == 'Delivered') {
          console.log('matched delivered so amount crediting')
          await updateWallet(
            totalPrice,
            'credit',
            `Refund for cancelled Order ID: ${orderId}`,
            orderId,
          )
          console.log('amount credited')
        }
        fetchOrderDetails();
        console.log('cod is not delivered so it just cancelled here..')
        return;
      }
      console.log('other payments than cod amount crediting here')
      await updateWallet(
        totalPrice,
        'credit',
        `Refund for cancelled Order ID: ${orderId}`,
        orderId,
      )
      fetchOrderDetails();
    } catch (error) {
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleReturnOrder = async (orderId) => {
    try {
      const cancelledOrder = orders.find((order) => order.orderId === orderId);
      const { totalPrice } = cancelledOrder;
      const response = await axiosInstance.patch('/user/returnOrder', { orderId })
      showSuccessToast(response.data?.message);

      await updateWallet(
        totalPrice,
        'credit',
        `Refund for returned Orden ID: ${orderId}`,
        orderId,
      )
      fetchOrderDetails();
    } catch (error) {
      console.log('return error', error)
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleCancelProduct = async (productId, orderId) => {
    try {
      console.log('check product id ', productId)
      const response = await axiosInstance.patch('/user/cancelProduct', {
        orderId,
        productId,
      });
      fetchOrderDetails();
      showSuccessToast(response.data.message);
    } catch (error) {
      console.log('error happens while cancelling the order: ', error)
      showErrorToast(error.response.data.message)
    }
  }

  const handleReturnProduct = async (productId, orderId, reason) => {
    try {
      console.log('check product id ', productId, orderId, reason);
      
      const response = await axiosInstance.patch('/user/returnRequest',{
        orderId,
        productId,
        reason,
      })
      fetchOrderDetails();
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  }

  const handleAlertClick = (orderId, action, productId) => {
    const messages = {
      cancel: 'Are you sure you want to cancel this order?',
      return: 'Are you sure you want to return this order?',
      cancelProduct: 'Are you sure you want to cancel this product?',
      returnProduct: 'Are you sure you want to return this product?',
    };

    console.log('check the order id here as properly here : ', orderId, productId)
    const alertMessage = messages[action];
    setMessage(alertMessage);
    setOrderId(orderId);
    setProductId(productId); 
    setAlertOpen(true);
  };


  const handlePageChange = (event, value) => {
    fetchOrderDetails(value)
  }

  const handleInvoiceDownload = async (orderId) => {
    try {
      const { jsPDF } = await import('jspdf');
      const order = orders.find((order) => order.orderId === orderId);

      if (!order) {
        console.error("Order not found!");
        return;
      }
      const doc = new jsPDF();

      doc.setFontSize(24);
      doc.setTextColor("#333");
      doc.text("Furniro", 14, 20);
      doc.setFontSize(12);
      doc.text(`Invoice Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.setLineWidth(0.5);
      doc.line(14, 32, 200, 32);

      doc.setFontSize(16);
      doc.text("Order Details", 14, 50);

      doc.setFontSize(12);
      doc.text(`Order ID: ${order.orderId}`, 14, 60);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 70);
      doc.text(`Customer Name: ${order.name}`, 14, 80);
      doc.text(`Delivery Address: ${order.address}`, 14, 90);
      doc.text(`Payment Method: ${order.payment}`, 14, 100);
      doc.text(`Payment Status: ${order.paymentStatus}`, 14, 110);
      doc.text(`Order Status: ${order.status}`, 14, 120);

      doc.setFontSize(16);
      doc.text("Ordered Items", 14, 140);

      const headers = ["Product Name", "Quantity", "Unit Price", "Total Price"];
      const columnWidths = [70, 30, 40, 40];
      let currentY = 150;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      let xPos = 14;
      headers.forEach((header, index) => {
        doc.text(header, xPos, currentY);
        xPos += columnWidths[index];
      });

      doc.setFont("helvetica", "normal");
      currentY += 10;

      order.orderedItems.forEach((item) => {
        const productName = item.name || "Unknown Product";
        const quantity = item.quantity;
        const unitPrice = `Rs ${item.price}`;
        const totalPrice = `Rs ${item.price * quantity}`;

        let xPos = 14;
        doc.text(productName, xPos, currentY);
        xPos += columnWidths[0];
        doc.text(`${quantity}`, xPos, currentY);
        xPos += columnWidths[1];
        doc.text(unitPrice, xPos, currentY);
        xPos += columnWidths[2];
        doc.text(totalPrice, xPos, currentY);

        currentY += 10;
      });

      doc.setFontSize(16);
      doc.text(`Total Price: Rs ${order.totalPrice}`, 14, currentY + 10);

      currentY += 30;
      doc.setFontSize(14);
      doc.text("Thank you for shopping with us!", 14, currentY);
      currentY += 10;
      doc.setFontSize(12);
      doc.text("For any queries, contact us at: furniro@gmail.com", 14, currentY);

      // Divider Line
      currentY += 20;
      doc.setLineWidth(0.5);
      doc.line(14, currentY, 200, currentY);

      // Digital Signature
      currentY += 10;
      doc.setFontSize(14);
      doc.text("Furniro", 14, currentY);
      currentY += 8;
      doc.text("CEO: Athul Krishna K S", 14, currentY);
      currentY += 20;
      doc.text("________________________", 14, currentY); // Signature line
      currentY += 8;
      doc.text("Athul Krishna K S", 14, currentY); // Signature name

      // Save PDF
      doc.save(`invoice_${orderId}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const steps = [
    { label: 'Pending', icon: <ShoppingCartOutlinedIcon /> },
    { label: 'Processing', icon: <HourglassEmpty /> },
    { label: 'Shipped', icon: <LocalShippingIcon /> },
    { label: 'Delivered', icon: <CheckCircleIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Orders</Typography>
      {/* Display orders with a fixed height and scrollable area */}
      <Box
        sx={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#000',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        {orders.length == 0 ? (
          <Typography variant="h6" align="center" color="textSecondary" sx={{ marginTop: '20px' }}>
            No orders are made till now.{' '}
            <Typography
              component="span"
              sx={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Typography>
          </Typography>
        ) : (
          orders.map((order) => (
            <Box key={order.orderId} sx={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', position: 'relative' }}>
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor:
                    order.status === 'Pending' ? '#f0ad4e' :
                      order.status === 'Processing' ? '#0275d8' :
                        order.status === 'Shipped' ? '#5bc0de' :
                          order.status === 'Delivered' ? '#5cb85c' :
                            order.status === 'Cancelled' ? '#d9534f' :
                              order.status === 'Returned' ? '#6c757d' :
                                '#6c757d',
                  color: '#ffffff',
                  padding: '5px 10px',
                  fontWeight: 'normal',
                  borderRadius: '5px'
                }}
              >
                Status: {order.status}
              </Typography>

              <Typography variant="h6" gutterBottom>Order ID: {order.orderId}</Typography>
              <Typography variant="h6">User Name: {order.name}</Typography>
              <Typography variant="h6">Total Price: ₹{order.totalPrice}</Typography>
              <Typography variant="h6">Payment Method: {order.payment}</Typography>
              <Typography variant="h6">Payment Status: {order.paymentStatus}</Typography>
              <Typography variant="h6">
                Ordered Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              <Typography variant="h6">Address: {order.address}</Typography>

              {/* Progress Bar */}
              <OrderProgress order={order} steps={steps} />

              {/* Toggle Product List Button */}
              <ExpandedOrder
                order={order}
                handleAlertClick={handleAlertClick}
              />

              {/* Return Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '20px 0',
                }}
              >
                {/* Return Button */}
                {/* {order.status == 'Delivered' && (
                  <Button
                    onClick={() => handleAlertClick(order.orderId, 'return')}
                    sx={{
                      color: '#007BFF',
                      fontSize: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'none',
                      padding: '8px 16px',
                      border: '1px solid #007BFF',
                      borderRadius: '5px',
                      '&:hover': {
                        backgroundColor: '#E0F3FF',
                      },
                    }}
                  >
                    <ReplayIcon sx={{ fontSize: '20px' }} />
                    Return
                  </Button>
                )} */}

                {/* Cancel Button (only for Pending or Processing status) */}
                {(order.status === 'Pending' || order.status === 'Processing') && (
                  <Button
                    onClick={() => handleAlertClick(order.orderId, 'cancel')}
                    sx={{
                      color: '#DC3545',
                      fontSize: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'none',
                      padding: '8px 16px',
                      border: '1px solid #DC3545',
                      borderRadius: '5px',
                      '&:hover': {
                        backgroundColor: '#FDEDEC',
                      },
                    }}
                  >
                    <CancelIcon sx={{ fontSize: '20px' }} />
                    Cancel
                  </Button>
                )}

                {/* Invoice Button (only for Delivered status) */}
                {order.status === 'Delivered' && (
                  <Button
                    onClick={() => handleInvoiceDownload(order.orderId)}
                    sx={{
                      color: '#28A745',
                      fontSize: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'none',
                      padding: '8px 16px',
                      border: '1px solid #28A745',
                      borderRadius: '5px',
                      '&:hover': {
                        backgroundColor: '#EAF8EA',
                      },
                    }}
                  >
                    <Download sx={{ fontSize: '20px' }} />
                    Download Invoice
                  </Button>
                )}
              </Box>
            </Box>
          ))
        )}
      <AlertConfirm
        open={alertOpen}
        message={message}
        onConfirm={() => {
          if (message.includes('cancel') && !productId) {
            handleCancelOrder(orderId); 
          } else if (message.includes('return') && !productId) {
            handleReturnOrder(orderId, reason); 
          } else if (message.includes('cancel') && productId) {
            handleCancelProduct(productId, orderId); 
          } else if (message.includes('return') && productId) {
            handleReturnProduct(productId, orderId, reason); 
          }
          setReason(''); 
          setAlertOpen(false);
        }}
        onCancel={() => {
          setReason(''); 
          setAlertOpen(false);
        }}
      >
      {message.includes('return') && (
        <textarea
          placeholder="Enter reason for return"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: '100%',  
            maxWidth: '380px', 
            height: '80px', 
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '8px',
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif', 
            fontWeight: 'normal',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'none', 
            outline: 'none',
            }}
          />
        )}
      </AlertConfirm>

      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
    </Box>
  );
};

export default OrderDetail;
