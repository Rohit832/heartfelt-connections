import React, { useState } from 'react';

const BookingForm = ({ test, onClose, onConfirm }) => {
    if (!test) return null;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        date: '',
        time: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ ...formData, testId: test.id, testName: test.name, price: test.price });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(29, 53, 87, 0.6)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease'
        }} onClick={onClose}>
            <div className="glass-panel" style={{
                width: '95%', maxWidth: '500px', background: 'white', padding: '2rem',
                maxHeight: '90vh', overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>Book Appointment</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{test.name}</p>
                    <p style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                        <span style={{ fontWeight: 'bold' }}>₹{test.price}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Patient Name</label>
                        <input
                            required
                            name="name"
                            type="text"
                            placeholder="Enter full name"
                            style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none', transition: 'border 0.2s' }}
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Phone Number</label>
                        <input
                            required
                            name="phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
                            style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none' }}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Collection Address</label>
                        <textarea
                            required
                            name="address"
                            placeholder="Full address (pincode logic not implemented)"
                            rows="2"
                            style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none', resize: 'none' }}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Date</label>
                            <input
                                required
                                name="date"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none' }}
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Time</label>
                            <select
                                required
                                name="time"
                                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e0e0e0', outline: 'none', background: 'white' }}
                                value={formData.time}
                                onChange={handleChange}
                            >
                                <option value="">Select Slot</option>
                                <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                                <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, border: '1px solid #e0e0e0', background: 'white' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
