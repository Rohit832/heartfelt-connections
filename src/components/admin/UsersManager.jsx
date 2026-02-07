
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error loading users. Check console.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateUserRole = async (id, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role. You might not have permission.');
        }
    };

    const toggleUserStatus = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#333' }}>Manage Users & Roles</h3>
                <button
                    onClick={() => fetchUsers()}
                    style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading users...</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', color: '#495057', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>User</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Email</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Role</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{user.full_name || 'N/A'}</strong><br />
                                        <small style={{ color: '#888' }}>ID: {user.id.slice(0, 8)}...</small>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                                            style={{
                                                padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd',
                                                background: user.role === 'admin' ? '#e8eaf6' : user.role === 'staff' ? '#e3f2fd' : 'white',
                                                fontWeight: user.role !== 'user' ? 'bold' : 'normal',
                                                color: user.role === 'admin' ? '#1a237e' : user.role === 'staff' ? '#0d47a1' : '#333'
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem',
                                            background: user.is_active ? '#e8f5e9' : '#ffebee',
                                            color: user.is_active ? '#2e7d32' : '#c62828'
                                        }}>
                                            {user.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                            style={{
                                                background: 'white', border: '1px solid #ddd',
                                                color: user.is_active ? '#d32f2f' : '#388e3c',
                                                padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                            }}
                                        >
                                            {user.is_active ? 'Disable' : 'Activate'}
                                        </button>
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

export default UsersManager;
