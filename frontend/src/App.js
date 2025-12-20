import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import HomePage3D from './components/HomePage3D';
import './App.css';

function App() {
    // eslint-disable-next-line no-unused-vars
    const [darkMode, setDarkMode] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        // Welcome stays until user clicks button
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? 'dark-mode' : '';
    }, [darkMode]);

    const handleWelcomeEnter = () => {
        setShowWelcome(false);
    };

    return (
        <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            {showWelcome && <Welcome onEnter={handleWelcomeEnter} />}
            
            {!showWelcome && (
                <HomePage3D />
            )}
        </div>
    );
}

export default App;