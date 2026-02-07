import React from 'react';

const Hero = () => {
    return (
        <section className="container section" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center', minHeight: '85vh' }}>
            <div>
                <span style={{
                    background: 'rgba(0, 119, 182, 0.08)', color: 'var(--primary)',
                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                    fontWeight: '700', fontSize: '0.85rem', marginBottom: '2rem', display: 'inline-block',
                    border: '1px solid rgba(0, 119, 182, 0.1)'
                }}>
                    TRUSTED BY 10,000+ FAMILIES IN RANCHI
                </span>
                <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Pro Health Checkups <br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>at Your Doorstep</span>
                </h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '540px', lineHeight: '1.7' }}>
                    Skip the queue. Book certified NABL lab tests from the comfort of your home. Fast reports, safe collection, best prices.
                </p>

                <div style={{
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    display: 'flex',
                    gap: '0.5rem',
                    maxWidth: '500px',
                    border: '1px solid rgba(0,0,0,0.03)'
                }}>
                    <div style={{ flex: 1, paddingLeft: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search tests (e.g. CBC, Thyroid, Sugar)"
                            style={{
                                width: '100%', border: 'none', background: 'transparent',
                                padding: '0 1rem', fontSize: '1rem', outline: 'none',
                                color: 'var(--text-main)'
                            }}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
                        Search
                    </button>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>100%</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Safe & Hygienic</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>24h</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Digital Reports</p>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div style={{
                    width: '100%', height: '550px',
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary-dark))',
                    borderRadius: 'var(--radius-lg)', opacity: '0.05', position: 'absolute', top: '3rem', right: '-3rem', zIndex: -1
                }}></div>
                {/* Placeholder for Hero Image */}
                <div style={{
                    width: '100%', height: '550px',
                    backgroundColor: '#e0e7ff',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '24px',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                        padding: '2rem',
                        color: 'white'
                    }}>
                        <p style={{ fontWeight: '500' }}>Professional Care</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
