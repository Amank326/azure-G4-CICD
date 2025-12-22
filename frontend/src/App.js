import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import HomePage3D from './components/HomePage3D';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        // Load dark mode preference from localStorage
        return localStorage.getItem('userSettings_darkMode') === 'true';
    });
    const [showWelcome, setShowWelcome] = useState(true);

    // Initialize userId on app startup
    useEffect(() => {
        // Check if userId exists, if not create one
        if (!localStorage.getItem('userId')) {
            const newUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', newUserId);
            console.log('✅ Generated new User ID:', newUserId);
        } else {
            console.log('ℹ️ Using existing User ID:', localStorage.getItem('userId'));
        }
    }, []);

    useEffect(() => {
        // Apply dark mode class to body and html
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.documentElement.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.remove('dark-mode');
        }
        // Save preference
        localStorage.setItem('userSettings_darkMode', darkMode);
    }, [darkMode]);

    // Listen for storage changes from other tabs/components
    useEffect(() => {
        const handleStorageChange = () => {
            const savedDarkMode = localStorage.getItem('userSettings_darkMode') === 'true';
            if (savedDarkMode !== darkMode) {
                setDarkMode(savedDarkMode);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [darkMode]);

    const handleWelcomeEnter = () => {
        setShowWelcome(false);
    };

    return (
        <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            {showWelcome && <Welcome onEnter={handleWelcomeEnter} />}
            
            {!showWelcome && (
                <HomePage3D darkMode={darkMode} setDarkMode={setDarkMode} />
            )}
        </div>
    );
}

export default App;