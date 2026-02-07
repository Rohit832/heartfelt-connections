import React, { useState, useEffect } from 'react';

const BannerCarousel = () => {
    const banners = [
        {
            id: 1,
            image: '/lipid_profile_banner.png',
            alt: 'Lipid Profile Offer'
        },

        {
            id: 2,
            image: '/thyroid_banner.png',
            alt: 'Thyroid Profile Checkup'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9' // Maintain aspect ratio or adjust as needed
        }}>
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        zIndex: index === currentIndex ? 1 : 0
                    }}
                >
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Ensure cover
                    />
                </div>
            ))}

            {/* Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 2
            }}>
                {banners.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: index === currentIndex ? '24px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            background: index === currentIndex ? '#ffd54f' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
