
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    profiles:user_id (full_name, email)
                `)
                .order('created_at', { ascending: false });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Error loading bookings. Check console.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update locally
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#333' }}>Manage Bookings</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => fetchBookings()}
                        style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Refresh
                    </button>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888', background: '#fafafa', borderRadius: '8px' }}>
                    No bookings found matching filters.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', color: '#495057', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Patient</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Test</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Contact</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(booking.booking_date).toLocaleDateString()}<br />
                                        <small style={{ color: '#888' }}>{new Date(booking.booking_date).toLocaleTimeString()}</small>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{booking.patient_name}</strong><br />
                                        <small style={{ color: '#666' }}>{booking.address}</small>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                            {booking.test_name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {booking.phone}<br />
                                        {booking.profiles?.email && <small>{booking.profiles.email}</small>}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                                            background:
                                                booking.status === 'confirmed' ? '#e8f5e9' :
                                                    booking.status === 'completed' ? '#e3f2fd' :
                                                        booking.status === 'cancelled' ? '#ffebee' : '#fff3e0',
                                            color:
                                                booking.status === 'confirmed' ? '#2e7d32' :
                                                    booking.status === 'completed' ? '#1565c0' :
                                                        booking.status === 'cancelled' ? '#c62828' : '#ef6c00'
                                        }}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    style={{
                                                        background: '#4caf50', color: 'white', border: 'none',
                                                        padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'completed')}
                                                    style={{
                                                        background: '#2196f3', color: 'white', border: 'none',
                                                        padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    style={{
                                                        background: 'transparent', color: '#d32f2f', border: '1px solid #d32f2f',
                                                        padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingsManager;
