import React from 'react';
import './style.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="dot" style={{ backgroundColor: '#614487' }}></div>
                <div className="dot" style={{ backgroundColor: '#F3625F' }}></div>
                <div className="dot" style={{ backgroundColor: '#614487' }}></div>
            </div>
        </div>
    );
};

export default Loader;
