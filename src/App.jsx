
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './components/HeroSection.css';
import UtilityBar from './components/UtilityBar';

import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import ChatWidget from './components/ChatWidget';
import './App.css';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetUpdatePassword from './pages/ResetUpdatePassword';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Use auth from context

  // Check if current route is an admin route to possibly hide Navbar/Footer
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <UtilityBar />}
      {!isAdminRoute && <Navbar onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} session={user} />}
      {!isAdminRoute && <ChatWidget session={user} />}

      <Routes>
        <Route path="/" element={<Home navigate={navigate} currentUser={user} />} />
        <Route path="/profile" element={<UserProfile session={user} />} />

        {/* Reports Page Placeholder */}
        <Route path="/reports" element={
          <div className="container section" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>My Reports</h2>
            {user ? (
              <p style={{ color: '#666' }}>No reports available right now. Once your tests are completed, reports will appear here.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ color: '#666' }}>Please login to view your reports.</p>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>Login Now</button>
              </div>
            )}
          </div>
        } />

        {/* Cart Page Placeholder */}
        <Route path="/cart" element={
          <div className="container section" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Your Cart is Empty</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Looks like you haven't added any tests yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Tests</button>
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-update-password" element={<ResetUpdatePassword />} />

        <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
