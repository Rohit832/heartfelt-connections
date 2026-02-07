
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const ResetUpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [sessionReady, setSessionReady] = useState(false);
    const navigate = useNavigate();

    // Verify we are in a recovery session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSessionReady(true);
            } else {
                // If no session, wait for the #hash to be processed by Supabase client
                const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                    if (session) {
                        setSessionReady(true);
                    }
                });
                return () => authListener.subscription.unsubscribe();
            }
        };
        checkSession();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (!sessionReady) {
            setError("Session not ready. Please reload the page from your email link.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password });
            if (error) throw error;
            setMessage("Password updated successfully! Redirecting...");
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            console.error("Update error:", error);
            setError(error.message || "Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ maxWidth: '400px', width: '100%', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#1a237e', marginBottom: '1rem', textAlign: 'center' }}>Set New Password</h2>

                {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{message}</div>}
                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Minimum 6 characters"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !sessionReady}
                        style={{
                            background: sessionReady ? '#1a237e' : '#ccc', color: 'white', padding: '0.875rem',
                            borderRadius: '6px', border: 'none', fontWeight: 'bold',
                            cursor: (loading || !sessionReady) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Updating...' : (sessionReady ? 'Update Password' : 'Verifying Link...')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetUpdatePassword;
