import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const adminId = localStorage.getItem('adminId'); 
        if (!adminId) {
            console.log('Admin is not authenticated. Redirecting to /admin-login...');
            navigate('/admin-login'); 
        }
    }, [navigate]);

    return localStorage.getItem('adminId') ? children : null;
};

export default ProtectAdmin;
