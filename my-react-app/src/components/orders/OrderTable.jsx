import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Select, MenuItem, Box, Pagination, Modal, Typography } from '@mui/material';
import { Payment, CalendarToday, LocationOn } from '@mui/icons-material';

const validStatusTransitions = {
  Pending: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
  Processing: ['Shipped', 'Delivered', 'Cancelled'],
  Shipped: ['Delivered', 'Cancelled'],
  Delivered: ['Cancelled'],
  Cancelled: [],
  Returned: [],
};

const OrderTable = ({ orders, handleSaveStatus, handleReturnRequest }) => {
  const [statusUpdates, setStatusUpdates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const rowsPerPage = 7;
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const handleStatusChange = (orderId, newStatus) => setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  const handleSave = (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (newStatus) handleSaveStatus(orderId, newStatus);
    setStatusUpdates(prev => ({ ...prev, [orderId]: undefined }));
  };

  const handleOpenModal = (order) => { setSelectedOrder(order); setOpenModal(true); };
  const handleCloseModal = () => setOpenModal(false);

  const getAvailableStatuses = (currentStatus) => validStatusTransitions[currentStatus] || [];
  const handlePageChange = (event, value) => setCurrentPage(value);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + rowsPerPage);

  const handleReturnAction = (orderId, productId, action) => handleReturnRequest(orderId, productId, action);

  return (
    <Box sx={{ padding: '20px' }}>
      <TableContainer component={Paper} sx={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#81d4fa', color: 'white' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>Total Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>Status</TableCell>              
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center' }}>Actions</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => {
              const currentStatus = order.status;
              const tempStatus = statusUpdates[order.orderId] || currentStatus;
              return (
                <TableRow key={order.orderId} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>₹{order.finalPrice}</TableCell>
                  <TableCell>
                    <Select
                      value={tempStatus}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      sx={{
                        minWidth: '150px',
                        fontSize: '14px',
                        '& .MuiSelect-icon': { color: '#1976d2' },
                        '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f5f5f5' },
                        '& .MuiSelect-root': { padding: '6px 10px' }
                      }}
                    >
                      <MenuItem disabled value={currentStatus} sx={{ color: 'gray' }}>{currentStatus}</MenuItem>
                      {getAvailableStatuses(currentStatus).map((status) => (
                        <MenuItem key={status} value={status} sx={{ fontSize: '12px', color: status === 'Cancelled' ? 'red' : 'inherit' }}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => handleSave(order.orderId)}
                      disabled={!statusUpdates[order.orderId]}
                      sx={{
                        backgroundColor: statusUpdates[order.orderId] ? '#4CAF50' : 'gray',
                        color: 'white',
                        fontSize: '12px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#45a049' }
                      }}
                    >
                      Save Status
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenModal(order)}
                      sx={{
                        fontSize: '12px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        padding: '6px 12px',
                        '&:hover': { backgroundColor: '#1565c0' }
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </Box>

      {/* Order Details Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          {selectedOrder && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', textAlign: 'center' }}>Order Details</Typography>
              <Box sx={{ marginBottom: 3, maxHeight: 200, overflowY: 'auto' }}>
                {selectedOrder.orderedItems.map((item) => (
                  <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>{item.productName}</Typography>
                      <Typography sx={{ fontSize: '16px' }}>₹{item.pricePerUnit} x {item.quantity} = ₹{item.pricePerUnit * item.quantity}</Typography>
                      {/* Displaying return request details */}
                      <Typography
                        sx={{
                          fontSize: '14px',
                          padding: '5px 10px',
                          borderRadius: '10px',
                          color: item.returnRequest?.status === 'Pending' ? 'orange' :
                            item.returnRequest?.status === 'Accepted' ? 'green' :
                              item.returnRequest?.status === 'Rejected' ? 'red' : 'gray',
                          backgroundColor: item.returnRequest?.status === 'Pending' ? '#FFF3E0' :
                            item.returnRequest?.status === 'Accepted' ? '#E8F5E9' :
                              item.returnRequest?.status === 'Rejected' ? '#FFEBEE' : '#F5F5F5',
                        }}
                      >
                        {item.returnRequest
                          ? `Return Request: ${item.returnRequest.status} ${item.returnRequest.reason && item.returnRequest.status === 'Pending' ? `- ${item.returnRequest.reason}` : ''
                          }`
                          : 'Return Request: Not Requested'}
                      </Typography>
                      {/* Show buttons for accepting or rejecting returns only if status is 'Pending' */}
                      {item.returnRequest?.status === 'Pending' && (
                        <Box sx={{ marginTop: 1 }}>
                          <Button variant="outlined" color="primary" onClick={() => handleReturnAction(selectedOrder.orderId, item.productId, 'Accepted')}>Accept Return</Button>
                          <Button variant="outlined" color="secondary" sx={{ marginLeft: 2 }} onClick={() => handleReturnAction(selectedOrder.orderId, item.productId, 'Rejected')}>Reject Return</Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <Payment fontSize="medium" color="primary" />
                <Typography fontSize="18px">Payment Method: {selectedOrder.payment}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <CalendarToday fontSize="medium" color="primary" />
                <Typography fontSize="18px">Order Date: {selectedOrder.createdAt}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn fontSize="medium" color="primary" />
                <Typography fontSize="18px">Shipping Address: {selectedOrder.address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginTop: 2 }}>
                <Typography fontSize="16px">Total Price: ₹{selectedOrder.totalPrice}</Typography>
                <Typography fontSize="16px">Coupon Applied: {selectedOrder.couponApplied || 'No Coupon'}</Typography>
                <Typography fontSize="16px">Discount: ₹{selectedOrder.discountAmount || 0}</Typography>
                <Typography fontSize="16px">Final Price: ₹{selectedOrder.finalPrice}</Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderTable;
