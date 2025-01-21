import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import ConfirmationAlert from "../customAlert/AlertConfirm";
import { Add, DeleteOutlineOutlined } from "@mui/icons-material";
import CouponForm from "./CouponForm";

const CouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minPrice: "",
    maxPrice: "",
    expiryDate: "",
    count: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    discountType: "",
    discountValue: "",
    minPrice: "",
    maxPrice: "",
    expiryDate: "",
    count: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

  useEffect(() => {
    fetchCoupons(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchCoupons = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(`/admin/getCoupons?page=${page}`);
      setCoupons(data.coupons);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalCount: data.pagination.totalCount,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to fetch coupons");
    }
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
  };

  const validateField = (name, value, discountType) => {
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
  
    switch (name) {
      case "name":
        if (!value || !nameRegex.test(value)) {
          return "Name must contain only alphanumeric characters and spaces.";
        }
        break;
  
      case "discountValue":
        if (!value || Number(value) <= 0) {
          return "Discount value must be a positive number.";
        }
        if (discountType === "PERCENTAGE" && Number(value) > 100) {
          return "Discount value cannot exceed 100% for percentage discounts.";
        }
        break;

      case "minPrice":
      case "maxPrice":
      case "count":
        if ((name === "minPrice" && discountType === "PERCENTAGE") || 
            (name === "maxPrice" && discountType === "FLAT")) {
          break;
        }
  
        if (!value || Number(value) <= 0) {
          return `${
            name === "discountValue"
              ? "Discount value"
              : name === "minPrice"
              ? "Minimum price"
              : name === "maxPrice"
              ? "Maximum price"
              : "Count"
          } must be a positive number.`;
        }
        break;
  
      case "expiryDate":
        if (!value || new Date(value) <= new Date()) {
          return "Expiry date must be a valid future date.";
        }
        break;
  
      default:
        return "";
    }
    return "";
  };
  
  const validateForm = (formData) => {
    const errors = {};  
    if (formData.discountType === "FLAT") {
      if (!formData.minPrice) {
        errors.minPrice = "Minimum price is required for flat discounts.";
      }
      delete errors.maxPrice;
    } else if (formData.discountType === "PERCENTAGE") {
      if (!formData.maxPrice) {
        errors.maxPrice =
          "Maximum price is required for percentage discounts.";
      }
      delete errors.minPrice;
    }
  
    for (const field in formData) {
      const error = validateField(field, formData[field], formData.discountType);
      if (error) {
        errors[field] = error;
      }
    }
  
    return errors;
  };
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    console.log('log check here: ', newCoupon);

    const errors = validateForm(newCoupon);
    console.log('check error here: ', errors)
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    console.log('req going to backend here')
    try {
      const response = await axiosInstance.post("/admin/createCoupon", newCoupon);
      showSuccessToast(response.data.message);
      fetchCoupons(pagination.currentPage);
      setNewCoupon({
        name: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minPrice: "",
        maxPrice: "",
        expiryDate: "",
        count: 0,
      });
      setOpen(false);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to create coupon.");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await axiosInstance.delete(`/admin/deleteCoupon`, { data: { couponId: id } });
      showSuccessToast("Coupon deleted successfully!");
      fetchCoupons(pagination.currentPage);
      setOpenDeleteModal(false);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to delete coupon.");
    }
  };

  const handleModalOpen = () => {
    setOpen(true);
    setNewCoupon({
      name: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minPrice: "",
      maxPrice: "",
      expiryDate: "",
      count: 0,
    });
  };

  const handleModalClose = () => {
    setErrors({
      name: "",
      discountType: "",
      discountValue: "",
      minPrice: "",
      maxPrice: "",
      expiryDate: "",
      count: "",
    });
    setOpen(false);
  };

  const handleDeleteModalOpen = (id) => {
    setSelectedCouponId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setSelectedCouponId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button startIcon={<Add />} onClick={handleModalOpen} style={{ marginBottom: "20px" }}>
        Create Coupon
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Discount Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Discount Value</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Minimum Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Maximum Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expiry Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Count</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Used</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow
                key={coupon._id}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                  "&:hover": { bgcolor: "#f1f1f1" },
                }}
              >
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>{coupon.discountValue}</TableCell>
                <TableCell>{coupon.minPrice}</TableCell>
                <TableCell>{coupon.maxPrice}</TableCell>
                <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>{coupon.count}</TableCell>
                <TableCell>{coupon.usedCount || 0}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    sx={{
                      color: "#f24f42",
                      "&:hover": {
                        bgcolor: "rgba(242, 79, 66, 0.1)",
                      },
                    }}
                    onClick={() => handleDeleteModalOpen(coupon._id)}
                  >
                    <DeleteOutlineOutlined />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={pagination.totalPages}
        page={pagination.currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />

      <CouponForm
        open={open}
        handleModalClose={handleModalClose}
        handleCreateCoupon={handleCreateCoupon}
        newCoupon={newCoupon}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <ConfirmationAlert
        open={openDeleteModal}
        onCancel={handleDeleteModalClose}
        onConfirm={() => handleDeleteCoupon(selectedCouponId)}
        message="Are you sure you want to delete this coupon?"
        title="Delete Coupon"
      />
    </div>
  );
};

export default CouponTable;
