
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(null); // null = loading/unknown

    if (loading) {
        return <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', color: '#666'
        }}>Authentication in progress...</div>;
    }

    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div style={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem'
            }}>
                <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Access Denied</h2>
                <p style={{ color: '#666', maxWidth: '500px' }}>
                    You do not have the required permissions ({allowedRoles.join('/')}) to view this page.
                    Your current role is: <strong>{role || 'user'}</strong>.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#333', color: 'white',
                        border: 'none', borderRadius: '6px', cursor: 'pointer'
                    }}
                >
                    Return Home
                </button>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
