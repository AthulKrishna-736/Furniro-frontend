import React from "react";
import AdminNavbar from "../../components/header/AdminNav";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponTable from "../../components/offers/CouponTable";

const AdminCoupon = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ marginLeft: "250px", width: "100%" }}>
        {/* Navbar */}
        <AdminNavbar />

        {/* Coupon Table Content */}
        <div style={{ padding: "16px" }}>
          <h1>Coupon Management</h1>
          <CouponTable />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AdminCoupon;
