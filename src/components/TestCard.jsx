import React from 'react';

const TestCard = ({ test, onBook }) => {
    // Mock discount calculation (assuming price is discounted)
    const originalPrice = Math.round(test.price * 1.4); 
    const discount = Math.round(((originalPrice - test.price) / originalPrice) * 100);

    return (
        <div className="glass-card" style={{
            display: 'flex', flexDirection: 'column',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            padding: '1.5rem',
            background: 'white',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
        }}>
            {test.popular && (
                <div style={{
                    position: 'absolute', top: '1rem', left: '-2rem',
                    background: 'var(--secondary)', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 2rem',
                    transform: 'rotate(-45deg)',
                    zIndex: 1
                }}>
                    POPULAR
                </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                    fontSize: '1.1rem', 
                    marginBottom: '0.5rem', 
                    color: 'var(--text-main)',
                    fontWeight: '700',
                    lineHeight: '1.4'
                }}>
                    {test.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', minHeight: '2.5em' }}>
                    {test.description}
                </p>
            </div>

            <div style={{ 
                background: 'var(--discount)', 
                padding: '0.5rem 0.75rem', 
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--discount-text)',
                fontWeight: '600'
            }}>
                ⏱ Report in {test.turnaround}
            </div>

            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>INCLUDES:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {test.features.slice(0, 3).map((feature, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 'bold', minWidth: '1rem' }}>✓</span>
                            {feature}
                        </div>
                    ))}
                    {test.features.length > 3 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', paddingLeft: '1.5rem', fontWeight: '500' }}>
                            + {test.features.length - 3} more parameters
                        </div>
                    )}
                </div>
            </div>

            <div style={{
                marginTop: 'auto', 
                borderTop: '1px solid #f0f0f0',
                paddingTop: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{test.price}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{originalPrice}</span>
                    <span style={{ 
                        color: 'var(--success)', 
                        background: 'rgba(42, 157, 143, 0.1)', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                    }}>
                        {discount}% OFF
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => onBook(test)}
                    style={{ width: '100%', borderRadius: '6px' }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default TestCard;
