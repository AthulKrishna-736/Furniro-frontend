import React from 'react';
import AdminNav from '../../components/header/AdminNav';
import AdminSidebar from '../../components/sidebar/AdminSidebar';


const AdminDash = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ marginLeft: '250px', width: '100%' }}>
        {/* Navbar */}
        <AdminNav />

        {/* Dashboard Content */}
        <div style={{ padding: '16px' }}>
          <h1>Welcome to the Admin Dashboard</h1>
          {/* Additional dashboard content goes here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
