
import React, { useState, useRef } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [serverOtp, setServerOtp] = useState('');
    const [step, setStep] = useState('email'); // 'email' | 'otp'
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Send OTP via Resend edge function
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data, error } = await supabase.functions.invoke('send-otp', {
                body: { email },
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            setServerOtp(data.otp);
            setMessage("OTP sent to your email!");
            setStep('otp');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP locally and sign in
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (otp !== serverOtp) {
                throw new Error("Invalid OTP code. Please try again.");
            }

            // OTP matched — use signInWithOtp + verifyOtp flow for session
            const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false },
            });

            if (signInError) throw signInError;

            setMessage("Verified! Redirecting to set new password...");
            setTimeout(() => navigate('/reset-update-password'), 1000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ maxWidth: '400px', width: '100%', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#1a237e', marginBottom: '1rem', textAlign: 'center' }}>
                    {step === 'email' ? 'Reset Password' : 'Enter OTP'}
                </h2>

                {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{message}</div>}
                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{error}</div>}

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your registered email"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ background: '#1a237e', color: 'white', padding: '0.875rem', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Sending...' : 'Get OTP Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Enter 6-digit code"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', letterSpacing: '2px', textAlign: 'center' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ background: '#1a237e', color: 'white', padding: '0.875rem', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Verifying...' : 'Verify & Proceed'}
                        </button>
                        <button type="button" onClick={() => setStep('email')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Change Email
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <a href="/login" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
