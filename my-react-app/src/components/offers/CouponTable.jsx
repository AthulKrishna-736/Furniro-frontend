import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import ConfirmationAlert from "../customAlert/AlertConfirm";

const CouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minPrice: "",
    expiryDate: "",
    usedCount: 0, 
  });

  const [open, setOpen] = useState(false); 
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State to control the confirmation modal
  const [selectedCouponId, setSelectedCouponId] = useState(null); // To store the ID of the coupon to be deleted

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch coupons from the server
  const fetchCoupons = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/getCoupons");
      setCoupons(data.coupons);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to fetch coupons");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/createCoupon", newCoupon);
      showSuccessToast("Coupon created successfully!");
      fetchCoupons(); // Fetch the updated coupon list from the server
      setNewCoupon({
        name: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minPrice: "",
        expiryDate: "",
        usedCount: 0, // Reset usedCount after coupon creation
      });
      setOpen(false); // Close the modal after coupon is created
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await axiosInstance.delete(`/admin/deleteCoupon`, { data: { couponId: id } });
      showSuccessToast("Coupon deleted successfully!");
      fetchCoupons(); // Fetch the updated coupon list from the server
      setOpenDeleteModal(false); // Close the delete confirmation modal
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleModalOpen = () => {
    setOpen(true); // Open the modal for creating coupon
  };

  const handleModalClose = () => {
    setOpen(false); // Close the create coupon modal
  };

  const handleDeleteModalOpen = (id) => {
    setSelectedCouponId(id); // Set the coupon ID to be deleted
    setOpenDeleteModal(true); // Open the confirmation modal
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false); // Close the confirmation modal
    setSelectedCouponId(null); // Clear the selected coupon ID
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Button to trigger modal */}
      <Button variant="contained" color="primary" onClick={handleModalOpen} style={{ marginBottom: "20px" }}>
        Create Coupon
      </Button>

      {/* Coupon Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Discount Value</TableCell>
              <TableCell>Minimum Price</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Used Count</TableCell> {/* Added Used Count column */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>{coupon.discountValue}</TableCell>
                <TableCell>{coupon.minPrice}</TableCell>
                <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>{coupon.usedCount}</TableCell> {/* Display Used Count */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteModalOpen(coupon._id)} // Open confirmation modal on delete click
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating coupon */}
      <Dialog
        open={open}
        onClose={handleModalClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '450px', 
            maxWidth: '450px',
          }
        }}
      >
        <DialogTitle>Create Coupon</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateCoupon} style={{ display: "grid", gap: "20px" }}>
            <TextField
              label="Coupon Name"
              name="name"
              value={newCoupon.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discountType"
                value={newCoupon.discountType}
                onChange={handleInputChange}
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FLAT">Flat</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount Value"
              name="discountValue"
              type="number"
              value={newCoupon.discountValue}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Minimum Price"
              name="minPrice"
              type="number"
              value={newCoupon.minPrice}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={newCoupon.expiryDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="Used Count"
              name="usedCount"
              type="number"
              value={newCoupon.usedCount}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreateCoupon} color="primary">
            Create Coupon
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Alert for Deleting Coupon */}
      <ConfirmationAlert
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={() => handleDeleteCoupon(selectedCouponId)} // Call delete on confirmation
        message="Are you sure you want to delete this coupon?"
        title="Delete Coupon"
      />
    </div>
  );
};

export default CouponTable;
