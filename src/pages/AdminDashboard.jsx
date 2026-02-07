
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingsManager from '../components/admin/BookingsManager';
import UsersManager from '../components/admin/UsersManager';

const AdminDashboard = () => {
    const { user, role, signOut } = useAuth();
    const [activeView, setActiveView] = useState('bookings'); // Default to bookings for now

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>
            {/* Sidebar Placeholder */}
            <div style={{ width: '250px', background: '#1a237e', color: 'white', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Ranchi Lab Admin</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li
                        onClick={() => setActiveView('dashboard')}
                        style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', opacity: activeView === 'dashboard' ? 1 : 0.7 }}
                    >
                        Dashboard
                    </li>
                    <li
                        onClick={() => setActiveView('bookings')}
                        style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', opacity: activeView === 'bookings' ? 1 : 0.7 }}
                    >
                        Bookings
                    </li>
                    <li
                        onClick={() => setActiveView('users')}
                        style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', opacity: activeView === 'users' ? 1 : 0.7 }}
                    >
                        Users & Roles
                    </li>
                    <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', opacity: 0.5 }}>Test Results (Coming Soon)</li>
                    <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', opacity: 0.5 }}>Transactions (Coming Soon)</li>
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button onClick={signOut} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer', width: '100%' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', color: '#333' }}>
                        {activeView === 'dashboard' ? 'Overview' : activeView === 'bookings' ? 'Bookings' : 'User Management'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>Welcome, {user?.email}</span>
                        <span style={{
                            background: '#e8eaf6', color: '#1a237e', padding: '0.2rem 0.6rem',
                            borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                        }}>
                            {role}
                        </span>
                    </div>
                </header>

                {activeView === 'dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Stat Card 1 */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Bookings</h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a237e' }}>0</p>
                        </div>
                        {/* Stat Card 2 */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Revenue</h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2e7d32' }}>₹0</p>
                        </div>
                    </div>
                )}

                {activeView === 'bookings' && <BookingsManager />}
                {activeView === 'users' && <UsersManager />}

                {activeView === 'dashboard' && (
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Welcome to the Admin Dashboard</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Select an option from the sidebar to manage bookings, view transactions, or update test details.
                            Currently, you can view and manage all patient bookings from the "Bookings" tab.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
