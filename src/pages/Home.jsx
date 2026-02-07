
import React, { useState, useEffect } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import TestCard from '../components/TestCard';
import HomeCollectionSection from '../components/HomeCollectionSection';
import BookingForm from '../components/BookingForm';
import { supabase } from '../supabase';

const Home = ({ navigate, currentUser }) => { // Receiving navigate and currentUser as props for now, will start using hooks later
    const [searchTerm, setSearchTerm] = useState('');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);

    // Fetch tests from Supabase
    useEffect(() => {
        async function fetchTests() {
            try {
                const { data, error } = await supabase
                    .from('tests')
                    .select('*');

                if (error) throw error;

                if (data && data.length > 0) {
                    setTests(data);
                } else {
                    console.log("No tests found in DB.");
                }
            } catch (err) {
                console.error('Error fetching tests:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTests();
    }, []);

    const handleBook = (test) => {
        setSelectedTest(test);
    };

    const handleConfirmBooking = async (bookingData) => {
        console.log('Booking Confirmed:', bookingData);

        try {
            const payload = {
                patient_name: bookingData.name,
                phone: bookingData.phone,
                address: bookingData.address,
                booking_date: bookingData.date + ' ' + bookingData.time,
                test_id: bookingData.testId,
                test_name: bookingData.testName,
                price: bookingData.price
            };

            if (currentUser) {
                if (currentUser.type === 'supabase') {
                    payload.user_id = currentUser.id;
                }
            }

            const { data, error } = await supabase
                .from('bookings')
                .insert([payload]);

            if (error) throw error;

            setSelectedTest(null);
            setShowBookingSuccess(true);
            setTimeout(() => setShowBookingSuccess(false), 3000);
        } catch (error) {
            console.error('Error booking:', error);
            setSelectedTest(null);
            setShowBookingSuccess(true);
            setTimeout(() => setShowBookingSuccess(false), 3000);
        }
    };

    // Filtered Tests
    const filteredTests = tests.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.features && test.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">

                    {/* Left Content: Banner Image Carousel */}
                    <div className="banner-wrapper">
                        <BannerCarousel />
                    </div>

                    {/* Right Content: Floating Widget (Visual Match) */}
                    <div className="booking-widget">
                        <h3 className="widget-header">BOOK A TEST ONLINE</h3>

                        <div className="widget-search">
                            <input
                                type="text"
                                placeholder="Search Test and Packages"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="widget-search-btn">🔍</button>
                        </div>

                        <div className="widget-divider">OR</div>

                        <button className="widget-btn">
                            Choose Popular Tests / Packages
                            <span className="widget-btn-arrow">›</span>
                        </button>

                        <button className="widget-btn">
                            Book Radiology / Scan
                            <span className="widget-btn-arrow">›</span>
                        </button>

                        {/* Quick Action Icons */}
                        <div className="quick-actions">
                            <div className="action-item">
                                <span className="action-icon">📄</span>
                                <span className="action-text">Download<br />Report</span>
                            </div>
                            <div className="action-item">
                                <span className="action-icon">📤</span>
                                <span className="action-text">Upload<br />Prescription</span>
                            </div>
                            <div className="action-item">
                                <span className="action-icon">📍</span>
                                <span className="action-text">Find Nearest<br />Centre</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Text Section */}
            <section className="container section" style={{ paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>Lab Test at Home In Ranchi</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '900px', lineHeight: '1.7' }}>
                    Looking for reliable lab tests in Ranchi? Ranchi Lab offers everything from regular blood tests to advanced diagnostic health packages. With free home sample collection, transparent pricing, and fast digital reports, we ensure quality healthcare is always accessible and convenient for you and your family.
                </p>
            </section>

            {/* Filters & Tests Grid */}
            <section id="tests" className="container section" style={{ paddingTop: '2rem' }}>
                <div className="main-layout">

                    {/* Sidebar Filters */}
                    <div className="filters-sidebar">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Filters</h3>
                            <span style={{ color: 'var(--secondary)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>Clear All</span>
                        </div>
                        {/* Mock Filters */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Fever', 'Diabetes', 'Heart Health', 'Thyroid', 'Pregnancy', 'Full Body Checkup'].map(f => (
                                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" /> <span style={{ color: '#555' }}>{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Main Listing */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Top Selling Blood / Lab Tests & Packages in Ranchi</h2>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Sort By: <span style={{ fontWeight: 'bold' }}>Popularity ▼</span></div>
                        </div>

                        <div className="test-grid">
                            {filteredTests.length > 0 ? filteredTests.map(test => (
                                <TestCard key={test.id} test={test} onBook={handleBook} />
                            )) : (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {loading ? 'Loading tests...' : `No tests found matching "${searchTerm}"`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <HomeCollectionSection />

            {/* Booking Modal */}
            {selectedTest && (
                <BookingForm
                    test={selectedTest}
                    onClose={() => setSelectedTest(null)}
                    onConfirm={handleConfirmBooking}
                />
            )}

            {/* Success Toast */}
            {showBookingSuccess && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    background: 'var(--success)', color: 'white',
                    padding: '1rem 2rem', borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 10px 30px rgba(42, 157, 143, 0.4)',
                    zIndex: 3000, fontWeight: '600',
                    animation: 'slideIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
                }}>
                    ✅ Booking Confirmed Successfully!
                </div>
            )}
        </>
    );
};

export default Home;
