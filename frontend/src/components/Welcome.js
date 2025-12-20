import React, { useState, useEffect } from 'react';
import './Welcome.css';

const Welcome = ({ onEnter }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleEnter = () => {
        setIsVisible(false);
        setTimeout(() => {
            onEnter();
        }, 600);
    };

    return (
        <div className={`welcome-overlay ${isVisible ? 'visible' : ''}`}>
            {/* Animated Background */}
            <div className="welcome-bg-animation">
                <div className="gradient-blob-1"></div>
                <div className="gradient-blob-2"></div>
                <div className="gradient-blob-3"></div>
            </div>

            <div className="welcome-container">
                {/* Animated Cloud Logo */}
                <div className="cloud-logo-container">
                    <div className="cloud-logo-main">
                        <div className="cloud-logo">☁️</div>
                        <div className="cloud-glow"></div>
                    </div>
                    <div className="cloud-pulse-1"></div>
                    <div className="cloud-pulse-2"></div>
                    <div className="cloud-pulse-3"></div>
                    <div className="floating-icons">
                        <span className="icon-float">📁</span>
                        <span className="icon-float">📝</span>
                        <span className="icon-float">💾</span>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="welcome-text">
                    <h1 className="project-title">
                        <span className="title-gradient">Cloud File & Notes</span>
                    </h1>
                    <p className="intro-line intro-1">🚀 Upload files with detailed notes and descriptions</p>
                    <p className="intro-line intro-2">🔒 Secure cloud storage for all your files</p>
                    <p className="intro-line intro-3">✨ Organize, annotate, and manage seamlessly</p>
                    <p className="intro-line intro-4">🎯 Your complete file and notes management system</p>
                </div>

                {/* Features Preview */}
                <div className="features-preview">
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span className="feature-text">Fast</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔐</span>
                        <span className="feature-text">Secure</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">☁️</span>
                        <span className="feature-text">Cloud</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <span className="feature-text">Analytics</span>
                    </div>
                </div>

                {/* Enter Button */}
                <button className="enter-btn" onClick={handleEnter}>
                    <span className="btn-text">Welcome</span>
                    <span className="btn-icon">→</span>
                </button>
                <p className="enter-hint">Click to enter your dashboard</p>
            </div>
        </div>
    );
};

export default Welcome;
