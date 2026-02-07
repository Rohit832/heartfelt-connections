
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { role } = useAuth();

    // Redirect if already logged in as admin
    React.useEffect(() => {
        if (role === 'admin' || role === 'staff') {
            navigate('/admin/dashboard');
        }
    }, [role, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check role after login (will be handled by AuthContext but we can double check here or wait for redirect)
            // The useEffect above will handle the redirect once role state updates.

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
                <div style={{
                    maxWidth: '400px', width: '100%',
                    background: 'white', padding: '2rem', borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #eee'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', color: '#1a237e', marginBottom: '0.5rem' }}>Admin Portal</h2>
                        <p style={{ color: '#666' }}>Authorized Personnel Only</p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#ffebee', color: '#c62828', padding: '0.75rem',
                            borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                                    border: '1px solid #ddd', fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                                    border: '1px solid #ddd', fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#1a237e', color: 'white', padding: '0.875rem',
                                borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem'
                            }}
                        >
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <a href="/forgot-password" style={{ color: '#1a237e', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot Password?</a>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
                        <p>Unauthorized access is prohibited and monitored.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminLogin;
