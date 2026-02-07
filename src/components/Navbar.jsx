import React from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate, session }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Top Row: Logo & Search/Location (Responsive) */}
                <div className="logo-section">
                    {/* Logo */}
                    <div className="logo-container" onClick={() => onNavigate('home')}>
                        <img src="https://redcliffelabs.com/images/rc-logo.svg" alt="Ranchi Lab" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                        <div style={{ display: 'none' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#4a148c', lineHeight: '1' }}>Ranchi Lab</span>
                        </div>
                    </div>
                </div>

                {/* Middle Row (Mobile) / Center (Desktop): Menu Links */}
                <div className={`desktop-menu ${isMenuOpen ? 'active' : ''}`}>

                    {/* Mobile Only: Location, User, Cart */}
                    <div className="nav-item-mobile header-mobile">
                        <span className="location-icon">📍</span>
                        <span className="location-text" style={{ display: 'inline' }}>Ranchi</span>
                    </div>

                    <div className="nav-item-mobile" onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}>
                        <span>👤</span>
                        <span>{session ? (session.identifier ? session.identifier.split('@')[0] : 'My Account') : 'Login / Sign Up'}</span>
                    </div>

                    <div className="nav-item-mobile" onClick={() => { onNavigate('cart'); setIsMenuOpen(false); }}>
                        <span>🛒</span>
                        <span>Cart (0)</span>
                    </div>

                    <div className="menu-divider mobile-only"></div>

                    <span className="nav-link active" onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}>BOOK HOME COLLECTION</span>
                    <span className="nav-link" onClick={() => setIsMenuOpen(false)}>BOOK RADIOLOGY / SCAN</span>
                    <span className="nav-link" onClick={() => setIsMenuOpen(false)}>DOCTORS</span>
                    <span className="nav-link" onClick={() => setIsMenuOpen(false)}>CAREER</span>
                </div>

                {/* Right: Location & Actions */}
                <div className="nav-actions">

                    {/* Location Selector */}
                    <div className="location-selector">
                        <span className="location-icon">📍</span>
                        <span className="location-text">Ranchi</span>
                        <span className="location-arrow">▼</span>
                    </div>

                    <div className="nav-divider"></div>

                    {/* User Links */}
                    <div className="nav-icon-link" onClick={() => onNavigate('profile')}>
                        <span>👤</span>
                        {session ? (
                            <span>{session.identifier ? session.identifier.split('@')[0] : 'My Account'}</span>
                        ) : (
                            <span>Login / Sign Up</span>
                        )}
                    </div>

                    {/* Cart */}
                    <div className="cart-icon-wrapper" onClick={() => onNavigate('cart')}>
                        <span className="cart-icon">🛒</span>
                        <div className="cart-badge">0</div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? '✕' : '☰'}
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
