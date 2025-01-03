import React from 'react';
import AdminSidebar from '../../components/sidebar/AdminSidebar'; // Sidebar
import AdminNavbar from '../../components/header/AdminNav'; // Navbar
import CatOffers from '../../components/offers/CatOffers'; // CatOffers Table

const CatOfferPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ marginLeft: '250px', width: '100%' }}>
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div style={{ padding: '16px' }}>
          <h1>Manage Category Offers</h1>
          
          {/* CatOffers Component */}
          <CatOffers />
        </div>
      </div>
    </div>
  );
};

export default CatOfferPage;
