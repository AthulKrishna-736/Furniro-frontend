import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const adminId = localStorage.getItem('adminId'); 
        if (!adminId) {
            navigate('/admin-login'); 
        }
    }, [navigate]);

    return localStorage.getItem('adminId') ? children : null;
};

export default ProtectAdmin;
