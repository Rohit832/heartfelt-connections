import React, { useState } from 'react';
import { supabase } from '../supabase';
import './HomeCollectionSection.css';

const HomeCollectionSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: 'Ranchi',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);

        try {
            const { error } = await supabase
                .from('bookings')
                .insert([{
                    patient_name: formData.name,
                    phone: formData.phone,
                    address: formData.city, // Defaulting to city as address is required in DB
                    test_name: 'Home Collection Callback Request',
                    price: 0
                }]);

            if (error) throw error;

            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({ name: '', phone: '', city: 'Ranchi', message: '' });

        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <section className="container section home-collection-wrapper">
            <div className="glass-card home-collection-grid">
                {/* Decorative Background Blob */}
                <div style={{
                    position: 'absolute', top: '-50%', right: '-20%', width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(0,119,182,0.1) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                        display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px',
                        background: 'rgba(0,119,182,0.1)', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem'
                    }}>
                        HOME COLLECTION
                    </span>
                    <h2 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        Can't visit the lab? <br />
                        <span style={{ color: 'var(--primary)' }}>We'll come to you.</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Book a safe and hygienic home sample collection. Our phlebotomists are trained to follow strict safety protocols.
                    </p>
                    <div className="collection-stats" style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>60 mins</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Arrival Time</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Zero</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Collection Fee</p>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1, background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--primary-dark)' }}>Request a Call Back</h3>

                    {submitted ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--success)', background: '#d1e7dd', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Thanks!</p>
                            <p>We've received your request. We'll call you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    pattern="[0-9]{10}"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                    Submit Request
                                </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                By submitting, you agree to our Terms & Conditions.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomeCollectionSection;
