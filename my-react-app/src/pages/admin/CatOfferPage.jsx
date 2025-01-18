import React from 'react';
import AdminSidebar from '../../components/sidebar/AdminSidebar'; // Sidebar
import AdminNavbar from '../../components/header/AdminNav'; // Navbar
import CatOffers from '../../components/offers/CatOffers'; // CatOffers Table
import { ToastContainer } from 'react-toastify';

const CatOfferPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />
      <ToastContainer/>
      {/* Main Content */}
      <div style={{ marginLeft: '250px', width: '100%' }}>
        {/* Navbar */}
        <AdminNavbar />
          {/* CatOffers Component */}
          <CatOffers />
      </div>
    </div>
  );
};

export default CatOfferPage;
