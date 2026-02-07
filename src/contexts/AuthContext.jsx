
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'staff', 'user'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            console.log("AuthProvider: Starting getSession...");

            // Create a timeout promise to prevent infinite loading
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    console.warn("AuthProvider: Session fetch timed out, defaulting to null");
                    resolve({ data: { session: null }, error: null });
                }, 2000); // 2 seconds strict timeout
            });

            try {
                // Race Supabase against the timeout
                const { data, error } = await Promise.race([
                    supabase.auth.getSession(),
                    timeoutPromise
                ]);

                if (error) {
                    console.error("AuthProvider: getSession error:", error);
                }

                const session = data?.session;
                console.log("AuthProvider: Session retrieved:", session ? "Active" : "None");

                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchUserRole(session.user.id);
                } else {
                    setRole(null);
                }
            } catch (err) {
                console.error("AuthProvider: Unexpected error in getSession:", err);
                setUser(null);
                setRole(null);
            } finally {
                console.log("AuthProvider: Check finished, setting loading to false");
                setLoading(false);
            }
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchUserRole(session.user.id);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching role:', error);
                setRole('user'); // Default to user on error
            } else {
                setRole(data?.role || 'user');
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            setRole('user');
        }
    };

    const value = {
        user,
        role,
        isAdmin: role === 'admin',
        isStaff: role === 'staff' || role === 'admin',
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#333' }}>Loading Application...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
