import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress, Pagination } from '@mui/material';
import { 
  LocalShipping as LocalShippingIcon, 
  CheckCircle as CheckCircleIcon, 
  ShoppingCartOutlined as ShoppingCartOutlinedIcon, 
  Cancel as CancelIcon, 
  ExpandMore as ExpandMoreIcon, 
  Replay as ReplayIcon,
  HourglassEmpty,
  Download, 
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { useNavigate } from 'react-router-dom';
import AlertConfirm from '../customAlert/AlertConfirm';

const OrderDetail = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderId, setOrderId] = useState('')
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('')
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

  const updateWallet = async(totalPrice, type, description, orderId)=>{
    try {
      const response = await axiosInstance.patch(`/user/updateWallet/${userId}`,{
        amount: totalPrice,
        type,
        description,
        orderId,
      })
      console.log('response of wallet promise: ', response.data)
    } catch (error) {
      console.log('error updating the cart: ',error.response.data?.message)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const cancelledOrder = orders.find((order)=> order._id === orderId);
      const { totalPrice, payment, status } = cancelledOrder;

      const response = await axiosInstance.patch('/user/cancelOrder', { orderId });
      showSuccessToast(response.data?.message);

      if(payment == 'COD'){
        console.log('cod this worked')
        if(status == 'Delivered'){
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

  const handleReturnOrder = async(orderId) => {
    console.log('button clicked')
    try {
      const cancelledOrder = orders.find((order)=> order._id === orderId);
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
      showErrorToast(error.response.data?.message);
    }
  };

  const toggleProductList = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };  

  const handleAlertClick = (orderId, action) => {
    console.log('clicked here')
    const messages = {
      cancel: 'Are you sure you want to cancel this order?',
      return: 'Are you sure you want to return this order?',
    };
    const alertMessage = messages[action]
    setMessage(alertMessage)
    setOrderId(orderId)
    setAlertOpen(true);
  };

  const handlePageChange  = (event, value)=>{
    fetchOrderDetails(value)
  }

  const handleInvoiceDownload = async (orderId) => {
    try {
      const { jsPDF } = await import('jspdf');
      const order = orders.find((order) => order._id === orderId);
  
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
      doc.text(`Order ID: ${order._id}`, 14, 60);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 70);
      doc.text(`Customer Name: ${order.userId.firstName}`, 14, 80);
      doc.text(`Delivery Address: ${order.selectedAddress}`, 14, 90);
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
        const product = item.productId;
        const productName = product.name || "Unknown Product";
        const quantity = item.quantity;
        const unitPrice = `Rs ${product.salesPrice}`;
        const totalPrice = `Rs ${product.salesPrice * quantity}`;
  
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
            <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
              {order.status === 'Cancelled' || order.status === 'Returned' ? (
                <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                  <CancelIcon
                    sx={{
                      fontSize: '60px',
                      marginBottom: '10px',
                      color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107', // Red for Cancelled, Yellow for Returned
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: order.status === 'Cancelled' ? '#d9534f' : '#ffc107', // Red for Cancelled, Yellow for Returned
                    }}
                  >
                    {order.status === 'Cancelled' ? 'Order Cancelled' : 'Order Returned'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {order.status === 'Cancelled'
                      ? 'This order has been cancelled and is no longer being processed.'
                      : 'This order has been returned successfully.'}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ padding: '20px', marginBottom: '20px', marginTop: '10px' }}>
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={
                        order.status === 'Pending'
                          ? 0
                          : order.status === 'Processing'
                          ? 33
                          : order.status === 'Shipped'
                          ? 66
                          : 100
                      }
                      sx={{
                        position: 'absolute',
                        top: '20px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        borderRadius: '4px',
                        backgroundColor: '#ddd',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#6c63ff',
                        },
                      }}
                    />

                    {/* Icons and Labels */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                      }}
                    >
                      {steps.map((step, index) => {
                        const stepPercentage = (index / (steps.length - 1)) * 100;
                        const progressPercentage =
                          order.status === 'Pending'
                            ? 0
                            : order.status === 'Processing'
                            ? 33
                            : order.status === 'Shipped'
                            ? 66
                            : 100;

                        const isActive = stepPercentage <= progressPercentage + 1;
                        const isCurrent = stepPercentage === progressPercentage;

                        return (
                          <Box
                            key={step.label}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              position: 'absolute',
                              left: `${stepPercentage}%`,
                              transform: 'translateX(-50%)',
                            }}
                          >
                            {/* Icon Circle */}
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                backgroundColor: isActive || isCurrent ? '#6c63ff' : '#ddd',
                                color: isActive || isCurrent ? '#fff' : '#000',
                              }}
                            >
                              {React.cloneElement(step.icon, { fontSize: '20px' })}
                            </Box>

                            {/* Label */}
                            <Typography
                              variant="body2"
                              sx={{
                                marginTop: '5px',
                                color: isActive || isCurrent ? '#6c63ff' : '#aaa',
                                fontSize: '12px',
                              }}
                            >
                              {step.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Toggle Product List Button */}
            <Button
              onClick={() => toggleProductList(order._id)}
              sx={{
                marginTop: '15px',
                backgroundColor: '#28a745',  
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                '&:hover': {
                  backgroundColor: '#218838',  
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease', 
                '&:active': {
                  transform: 'scale(0.98)', 
                },
              }}
            >
              <ExpandMoreIcon style={{ fontSize: '20px' }} />  
              {expandedOrder === order._id ? 'Hide Products' : 'Show Products'}
            </Button>

            {/* Display Product List for the Order */}
            {expandedOrder === order._id && (
              <Box sx={{ marginTop: '20px' }}>
                {order.orderedItems.map((item) => (
                  <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img
                      src={item.image}
                      alt={item.name || 'Product Image'}
                      width="50"
                      height="50"
                      style={{ marginRight: '15px', borderRadius: '5px', objectFit: 'cover' }}
                    />
                    <Typography variant="body1" sx={{ marginRight: '15px' }}>
                      {item.name || 'no name'}
                    </Typography>
                    <Typography variant="body2" sx={{ marginRight: '15px' }}>
                      ₹{item.price}
                    </Typography>
                    <Typography variant="body2" sx={{ marginRight: '15px'}}>
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      Total: ₹{item.quantity * item.price}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Return Button */}
            {order.status !== 'Cancelled' && order.status !== 'Returned' && (
              <Button
                onClick={() => handleAlertClick(order._id, 'return')}
                sx={{
                  marginTop: '15px',
                  backgroundColor: '#6c63ff',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                  '&:hover': {
                    backgroundColor: '#5848cc', 
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease', 
                  '&:active': {
                    transform: 'scale(0.98)', 
                  },
                }}
              >
                <ReplayIcon style={{ fontSize: '20px' }} />
                Return
              </Button>
            )}

            {/* Cancel Button */}
            {order.status !== 'Cancelled' && order.status !== 'Returned' && (
              <Button
                onClick={() => handleAlertClick(order._id, 'cancel')}
                sx={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '10px',
                  backgroundColor: '#e63946',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(230, 57, 70, 0.3)', 
                  '&:hover': {
                    backgroundColor: '#b32f3a',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s ease, transform 0.2s ease', 
                  '&:active': {
                    transform: 'scale(0.98)', 
                  },
                }}
              >
                <CancelIcon style={{ fontSize: '20px' }} />
                Cancel
              </Button>
            )}

            {/* Invoice Button */}
            {order.status === 'Delivered' && (
              <Button
                onClick={() => handleInvoiceDownload(order._id)}
                sx={{
                  position: 'absolute',
                  bottom: '1%', 
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#3b82f6', 
                  color: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s ease', 
                  '&:hover': {
                    backgroundColor: '#2563eb', 
                  },
                  '&:active': {
                    backgroundColor: '#1d4ed8', 
                  },
                }}
                
              >
                <Download />
                Download Invoice
              </Button>
            )}
          </Box>
        ))
      )}
        <AlertConfirm 
          open={alertOpen}
          message={message}
          onConfirm={()=> {
            if(message.includes('cancel')){
              handleCancelOrder(orderId);
            }else if(message.includes('return')){
              handleReturnOrder(orderId);
            }
            setAlertOpen(false);
          }}
          onCancel={() => setAlertOpen(false)}
        />
      </Box>
      <Box sx={{ display:'flex', justifyContent: 'center'}}>
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
