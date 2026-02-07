import React from 'react';
import './UtilityBar.css';

const UtilityBar = () => {
    return (
        <div className="utility-bar">
            <div className="utility-container">
                <span className="utility-link optional">Investors</span>
                <span className="utility-divider optional"></span>
                <span className="utility-link">Contact Us</span>
                <span className="utility-divider"></span>
                <div className="utility-contact">
                    <span>📞 898 898 8787</span>
                    <span style={{ width: '20px', textAlign: 'center' }}>|</span>
                    <span>✉️ care@ranchilab.com</span>
                </div>
            </div>
        </div>
    );
};

export default UtilityBar;
