import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Select,
  MenuItem,
  Box,
  Pagination,
  Modal,
  Typography,
} from '@mui/material';
import { LocationOn, Payment, CalendarToday, AccountBalanceWallet } from '@mui/icons-material';

const validStatusTransitions = {
  Pending: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
  Processing: ['Shipped', 'Delivered', 'Cancelled'],
  Shipped: ['Delivered', 'Cancelled'],
  Delivered: ['Cancelled'],
  Cancelled: [],
  Returned: [],
};

const OrderTable = ({ orders, handleSaveStatus }) => {
  const [statusUpdates, setStatusUpdates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleSave = (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (newStatus) {
      console.log('changed status: ', newStatus);
      handleSaveStatus(orderId, newStatus);
      setStatusUpdates((prev) => ({ ...prev, [orderId]: undefined }));
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const getAvailableStatuses = (currentStatus) => validStatusTransitions[currentStatus] || [];
  const handlePageChange = (event, value) => setCurrentPage(value);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ marginTop: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => {
              const currentStatus = order.status;
              const tempStatus = statusUpdates[order.orderId] || currentStatus;

              return (
                <TableRow key={order.orderId} hover>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Select
                      value={tempStatus}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      sx={{ minWidth: '120px', fontSize: '12px' }}
                    >
                      <MenuItem disabled value={currentStatus} sx={{ color: 'gray' }}>
                        {currentStatus}
                      </MenuItem>
                      {getAvailableStatuses(currentStatus).map((status) => (
                        <MenuItem
                          key={status}
                          value={status}
                          sx={{
                            fontSize: '12px',
                            color: status === 'Cancelled' ? 'red' : 'inherit',
                          }}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => handleSave(order.orderId)}
                      disabled={!statusUpdates[order.orderId]}
                      sx={{
                        backgroundColor: statusUpdates[order.orderId] ? '#4CAF50' : 'gray',
                        color: 'white',
                        fontSize: '12px',
                        padding: '6px 12px',
                        '&:hover': { backgroundColor: '#45a049' },
                      }}
                    >
                      Save Status
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenModal(order)}
                      sx={{ fontSize: '12px', backgroundColor: '#1976d2', color: 'white' }}
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedOrder && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', textAlign: 'center' }}>
                Order Details
              </Typography>
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
                      <Typography sx={{ fontSize: '16px' }}>
                        ₹{item.pricePerUnit} x {item.quantity} = ₹{item.pricePerUnit * item.quantity}
                      </Typography>
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
                <Typography fontSize="18px">
                  Shipping Address: {selectedOrder.address}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  backgroundColor: '#f9f9f9',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: 2,
                }}
              >
                {/* Total Price */}
                <Typography fontSize="16px" >
                  Total Price: ₹{selectedOrder.totalPrice}
                </Typography>

                {/* Coupon Name */}
                <Typography fontSize="16px" >
                  Coupon Applied: {selectedOrder.couponName || 'No Coupon'}
                </Typography>

                {/* Discount Price */}
                <Typography fontSize="16px" >
                  Discount: ₹{selectedOrder.discountPrice || 0}
                </Typography>

                {/* Final Price */}
                <Typography fontSize="16px" >
                  Final Price: ₹{selectedOrder.totalPrice - (selectedOrder.discountPrice || 0)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderTable;
