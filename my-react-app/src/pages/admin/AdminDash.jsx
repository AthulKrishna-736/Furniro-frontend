import React from 'react';
import AdminNav from '../../components/header/AdminNav';
import AdminSidebar from '../../components/sidebar/AdminSidebar';
import Chart from '../../components/dashboard/Chart';

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
          {/* Chart Component */}
          <div style={{ marginTop: '24px' }}>
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
