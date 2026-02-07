import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'white',
            padding: '4rem 0 2rem',
            marginTop: '4rem',
            borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            background: 'var(--danger)', borderRadius: '50%',
                            display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold'
                        }}>+</div>
                        <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>Ranchi Lab</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Premium home blood collection service in Ranchi. Reliable, fast, and affordable.
                    </p>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><a href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Home</a></li>
                        <li><a href="#tests" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Popular Tests</a></li>
                        <li><a href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>About Ranchi Lab</a></li>
                        <li><a href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Contact</h4>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>+91 98765 43210</p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>support@ranchilab.com</p>
                    <p style={{ color: 'var(--text-muted)' }}>Lalpur, Ranchi, Jharkhand 834001</p>
                </div>
            </div>

            <div className="container" style={{
                borderTop: '1px solid rgba(0,0,0,0.05)',
                paddingTop: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}>
                © 2026 Ranchi Lab Services. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
