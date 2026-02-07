import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { jsPDF } from "jspdf";

const UserProfile = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email' | 'google'
    const [isSignUp, setIsSignUp] = useState(false); // For email mode

    // Form States
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Profile Data
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);

    // Fetch Profile & Bookings when session exists
    useEffect(() => {
        if (session) {
            console.log("Logged in user:", session);
            if (session.type === 'supabase') {
                fetchProfileSupabase(session.id);
            }
            fetchBookings(session);
        }
    }, [session]);

    const fetchProfileSupabase = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchBookings = async (currentUser) => {
        try {
            let query = supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (currentUser.type === 'supabase') {
                // If using Supabase Auth, filter by user_id
                query = query.eq('user_id', currentUser.id);
            } else {
                // Determine filter for Firebase users (fallback to phone)
                const phone = currentUser.identifier;
                query = query.eq('phone', phone);
            }

            const { data, error } = await query;
            if (data) setBookings(data);
            if (error) console.error(error);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const generateReport = (booking) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Ranchi Lab - Diagnostic Report", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Patient Name: " + (booking.patient_name || 'N/A'), 20, 30);
        doc.text("Phone: +91 898 898 8787 | Email: care@ranchilab.com", 20, 36);

        doc.setDrawColor(200);
        doc.line(20, 45, 190, 45); // Horizontal Line

        // Patient Details
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Patient Information", 20, 55);

        doc.setFontSize(11);
        doc.text(`Name: ${booking.patient_name}`, 20, 65);
        doc.text(`Phone: ${booking.phone}`, 20, 72);
        doc.text(`Date: ${booking.booking_date || new Date().toLocaleDateString()}`, 120, 65);
        doc.text(`Booking ID: #${booking.id}`, 120, 72);

        // Test Details
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 85, 170, 10, 'F');
        doc.setFontSize(12);
        doc.text("Test Description", 25, 91);
        doc.text("Result", 150, 91);

        doc.setFontSize(11);
        doc.text(booking.test_name, 25, 105);

        // Mock Result Logic
        const mockResult = booking.id % 2 === 0 ? "Normal Range" : "Slightly Elevated";
        doc.text(mockResult, 150, 105);

        // Disclaimer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("This is a computer-generated report. No signature required.", 20, 250);
        doc.text("Generated via Ranchi Lab Online Portal.", 20, 256);

        // Save
        doc.save(`RanchiLab_Report_${booking.id}.pdf`);
    };

    // --- Google Login (Supabase) ---
    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) alert(error.message);
        setLoading(false);
    };

    // --- Firebase Phone Login ---
    // --- Firebase Phone Login ---
    // --- Firebase Phone Login ---
    const onCaptchVerify = () => {
        // Only create a new verifier if one doesn't exist
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved - verified!
                    console.log("reCAPTCHA Verified");
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // We clear it so next click creates a fresh one.
                    if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.clear();
                        window.recaptchaVerifier = null;
                    }
                }
            });
        }
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Initialize reCAPTCHA (idempotent - safe to call multiple times)
        try {
            onCaptchVerify();
        } catch (err) {
            // If initialization fails (e.g. already rendered but state lost), clear and retry
            console.warn("Recaptcha init warning:", err);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
                onCaptchVerify();
            }
        }

        const appVerifier = window.recaptchaVerifier;
        const formatPh = "+" + phone.replace(/\D/g, '');

        try {
            const confirmation = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            alert('OTP sent via Firebase!');
        } catch (error) {
            console.error(error);
            alert('Error sending OTP: ' + error.message);

            // Helpful for debugging: If it says 'rendered in this element', force a clear reload
            if (error.message.includes('rendered')) {
                window.location.reload();
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await confirmationResult.confirm(otp);
            // Auth state listener in App.jsx will pick this up
            alert('Phone Verified Successfully!');
        } catch (error) {
            console.error(error);
            alert('Invalid OTP');
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        if (!phone) return alert("Please enter phone number first");
        setLoading(true);
        try {
            onCaptchVerify();
            const appVerifier = window.recaptchaVerifier;
            const formatPh = "+" + phone.replace(/\D/g, '');
            const confirmation = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            setConfirmationResult(confirmation);
            alert('OTP Resent Successfully!');
        } catch (error) {
            console.error("Resend OTP Error:", error);
            alert('Failed to resend OTP: ' + error.message);
        }
        setLoading(false);
    };

    // --- Email Login / Signup (Supabase) ---
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: fullName } },
            });
            if (error) alert(error.message);
            else {
                alert('Registration successful! Please check your email.');
                setIsSignUp(false);
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                alert(error.message);
                // If checking for email confirmation error specifically
                if (error.message.includes("Email not confirmed")) {
                    const resend = confirm("Email not confirmed. Would you like to resend the confirmation link?");
                    if (resend) {
                        await supabase.auth.resend({ type: 'signup', email: email });
                        alert("Confirmation email resent!");
                    }
                }
            }
        }
        setLoading(false);
    }


    const handleLogout = async () => {
        if (session?.type === 'firebase') {
            await signOut(auth);
        } else {
            await supabase.auth.signOut();
        }
        setProfile(null);
        setBookings([]);
        window.location.reload(); // Hard reload to clear states
    };

    if (!session) {
        return (
            <div className="container section">
                {/* Firebase Invisible Recaptcha */}
                <div id="recaptcha-container"></div>

                <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)', fontSize: '1.8rem' }}>Welcome Back</h2>

                    {/* Login Tabs */}
                    <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                        <button
                            onClick={() => setAuthMode('phone')}
                            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: authMode === 'phone' ? '2px solid var(--primary)' : 'none', color: authMode === 'phone' ? 'var(--primary)' : '#888', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            Mobile
                        </button>
                        <button
                            onClick={() => setAuthMode('email')}
                            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: authMode === 'email' ? '2px solid var(--primary)' : 'none', color: authMode === 'email' ? 'var(--primary)' : '#888', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            Email
                        </button>
                    </div>

                    {authMode === 'phone' && (
                        !otpSent ? (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', color: '#555' }}>Phone Number (with Country Code)</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 9999999999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                        required
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Using Firebase Authentication</p>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Get OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', color: '#555' }}>Enter OTP</label>
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', textAlign: 'center', letterSpacing: '4px' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )
                    )}

                    {authMode === 'email' && (
                        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {isSignUp && (
                                <div>
                                    <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', color: '#555' }}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', color: '#555' }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', color: '#555' }}>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    required
                                    minLength={6}
                                />
                                {!isSignUp && (
                                    <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                                        <a href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                        <button
                            onClick={handleGoogleLogin}
                            className="btn"
                            style={{
                                width: '100%',
                                background: 'white', color: '#333', border: '1px solid #ccc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem',
                                transition: 'background 0.2s'
                            }}
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px' }} />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>My Profile</h1>
                <button onClick={handleLogout} className="btn" style={{ background: '#ffebee', color: '#c62828', border: 'none' }}>
                    Logout
                </button>
            </div>

            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Profile Card */}
                <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '100px', height: '100px', background: 'var(--primary-light)', color: 'var(--primary)',
                            borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'
                        }}>
                            {profile?.full_name ? profile.full_name[0] : (session.identifier ? session.identifier[1] : 'U')}
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>{profile?.full_name || 'User'}</h3>
                        <p style={{ color: '#666' }}>{session.identifier}</p>
                        {session.type === 'firebase' && <span style={{ fontSize: '0.8rem', background: '#ffa726', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Firebase User</span>}
                    </div>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Status</span>
                                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Booking History</h2>
                    {bookings.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{booking.test_name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.25rem' }}>Patient: <strong>{booking.patient_name}</strong></p>
                                        <p style={{ fontSize: '0.9rem', color: '#888' }}>{booking.booking_date} • {booking.address}</p>
                                    </div>

                                    <div style={{ textAlign: 'right', minWidth: '160px' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>₹{booking.price}</div>

                                        {/* Status Badge - Default to 'Booked' if null */}
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                                background: (booking.status === 'Report Ready') ? '#e8f5e9' : (booking.status === 'Sample Collected' ? '#e3f2fd' : '#fff3e0'),
                                                color: (booking.status === 'Report Ready') ? '#2e7d32' : (booking.status === 'Sample Collected' ? '#1976d2' : '#ef6c00')
                                            }}>
                                                {booking.status || 'Booked'}
                                            </span>
                                        </div>

                                        {/* Report Button */}
                                        {booking.status === 'Report Ready' ? (
                                            <button
                                                onClick={() => generateReport(booking)}
                                                style={{
                                                    background: 'var(--primary)', color: 'white', border: 'none',
                                                    padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                                                    marginTop: '0.5rem'
                                                }}
                                            >
                                                📄 Download Report
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#999', display: 'block', marginTop: '0.5rem' }}>
                                                {booking.status === 'Sample Collected' ? 'Analysis in Progress' : 'Report Pending'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '12px', border: '1px dashed #ccc' }}>
                            <p style={{ color: '#666', fontSize: '1.1rem' }}>No bookings found yet.</p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/'}>
                                Book a Test
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
