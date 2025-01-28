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
        if (status == 'Delivered') {
          await updateWallet(
            totalPrice,
            'credit',
            `Refund for cancelled Order ID: ${orderId}`,
            orderId,
          )
        }
        fetchOrderDetails();
        return;
      }

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
      showErrorToast(error.response?.data?.message);
    }
  };

  const handleCancelProduct = async (productId, orderId) => {
    try {
      const response = await axiosInstance.patch('/user/cancelProduct', {
        orderId,
        productId,
      });
      fetchOrderDetails();
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast(error.response.data.message)
    }
  }

  const handleReturnProduct = async (productId, orderId, reason) => {
    try {
      const response = await axiosInstance.patch('/user/returnRequest', {
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

      doc.setFontSize(14);
      doc.text("Coupon Details:", 14, 130);
      if (order.coupon) {
        doc.setFontSize(12);
        doc.text(`Coupon Name: ${order.coupon.name}`, 14, 140);
        doc.text(`Discount Value: ${order.coupon.discountValue}`, 14, 150);
      } else {
        doc.text("No Coupons Applied", 14, 140);
      }

      doc.setFontSize(16);
      doc.text("Ordered Items", 14, 170);

      const headers = ["Product Name", "Quantity", "Unit Price", "Total Price"];
      const columnWidths = [70, 30, 40, 40];
      let currentY = 180;

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

      currentY += 20;
      doc.setLineWidth(0.5);
      doc.line(14, currentY, 200, currentY);

      currentY += 10;
      doc.setFontSize(14);
      doc.text("Furniro", 14, currentY);
      currentY += 8;
      doc.text("CEO: Athul Krishna K S", 14, currentY);
      currentY += 20;
      doc.text("________________________", 14, currentY);
      currentY += 8;
      doc.text("Athul Krishna K S", 14, currentY);

      doc.save(`invoice_${orderId}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const handleRetryPayment = async (orderId, totalPrice) => {
    try {
      const { data } = await axiosInstance.post('/user/createOrder', {
        amount: totalPrice,
        currency: 'INR',
        userId,
      });

      const { order, user } = data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_ID_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Furniro Payment',
        description: 'Complete Your Purchase',
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          try {
            await axiosInstance.put(`/user/updateOrderPaymentStatus`, {
              orderId,
              paymentStatus: 'Completed',
              razorpayDetails: response,
            });
            fetchOrderDetails();
            showSuccessToast('Payment successful! Thank you for your order.');
          } catch (error) {
            showErrorToast('Payment processing failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await axiosInstance.put(`/user/updateOrderPaymentStatus`, {
                orderId,
                paymentStatus: 'Failed',
              });
            } catch (error) {
              console.error('Failed to update payment status on dismiss: ', error);
            }
            showErrorToast('Payment cancelled. Order status updated.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showErrorToast('Failed to fetch order details or initialize payment.');
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
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', marginBottom: '16px', textAlign: 'center' }} > 🛍️ Order Details
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>Order ID: <span style={{ color: '#007BFF' }}>{order.orderId}</span></Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>User Name: {order.name}</Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>Total Price: <span style={{ color: '#d9534f', fontWeight: 'bold' }}>₹{order.totalPrice}</span></Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>Payment Method: {order.payment}</Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>Payment Status:<span style={{ fontWeight: 'bold', color: order.paymentStatus === 'Paid' ? '#28a745' : '#d9534f' }}>{order.paymentStatus}</span></Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>
                Coupon Applied: <span style={{ color: order.coupon ? '#007BFF' : '#6c757d', fontWeight: order.coupon ? 'bold' : 'normal' }}>
                  {order.coupon?.name || 'No coupons'}
                </span>
              </Typography>
              {order.coupon && (
                <Typography variant="h6" sx={{ marginBottom: 0, color: 'green' }}>
                  Coupon Discount: <span style={{ fontWeight: 'bold' }}>{order.coupon?.discountValue}</span>
                </Typography>
              )}
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>
                Ordered Date:
                <span style={{ color: '#6c757d', marginLeft: '6px' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 0, color: '#555' }}>Address: {order.address}</Typography>

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

                {(order.payment === 'Razorpay' && order.paymentStatus === 'Failed') && (
                  <Button
                    onClick={() => handleRetryPayment(order.orderId, order.totalPrice)}
                    sx={{
                      color: '#FF9800',
                      fontSize: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'none',
                      padding: '8px 16px',
                      border: '1px solid #FF9800',
                      borderRadius: '5px',
                      '&:hover': {
                        backgroundColor: '#FFF3E0',
                      },
                    }}
                  >
                    Retry Payment
                  </Button>
                )}

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
            if (message?.includes('cancel') && !productId) {
              handleCancelOrder(orderId);
            } else if (message?.includes('return') && !productId) {
              handleReturnOrder(orderId, reason);
            } else if (message?.includes('cancel') && productId) {
              handleCancelProduct(productId, orderId);
            } else if (message?.includes('return') && productId) {
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
          {message?.includes('return') && (
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
