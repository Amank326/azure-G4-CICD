import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import FileSearch from './components/FileSearch';
import FileStats from './components/FileStats';
import './App.css';

function App() {
    const [files, setFiles] = useState([]);
    const [displayFiles, setDisplayFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchActive, setSearchActive] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? 'dark-mode' : '';
    }, [darkMode]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/files');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const filesList = Array.isArray(data) ? data : [];
            setFiles(filesList);
            setDisplayFiles(filesList);
            setError('');
        } catch (err) {
            setError('Failed to fetch files. Is the backend running?');
            console.error('Fetch error:', err);
            setFiles([]);
            setDisplayFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchResults) => {
        setDisplayFiles(searchResults);
        setSearchActive(searchResults.length > 0);
    };

    const handleUpload = (newFile) => {
        setFiles([newFile, ...files]);
        setDisplayFiles([newFile, ...displayFiles]);
    };

    const handleFileDelete = (fileId) => {
        setFiles(files.filter(file => file.id !== fileId));
        setDisplayFiles(displayFiles.filter(file => file.id !== fileId));
    };

    const handleFileUpdate = (updatedFile) => {
        setFiles(files.map(file => file.id === updatedFile.id ? updatedFile : file));
        setDisplayFiles(displayFiles.map(file => file.id === updatedFile.id ? updatedFile : file));
    };

    const handleClearSearch = () => {
        setDisplayFiles(files);
        setSearchActive(false);
    };

    return (
        <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <span className="brand-icon">☁️</span>
                        <h1>Cloud File Manager</h1>
                    </div>
                    <div className="navbar-actions">
                        <button 
                            className="theme-toggle"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <span className="status-badge">
                            {files.length} Files
                        </span>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    {error && (
                        <div className="error-banner">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                            <button onClick={fetchFiles} className="retry-btn">Retry</button>
                        </div>
                    )}

                    <FileStats />

                    <FileSearch onSearch={handleSearch} />

                    {searchActive && (
                        <div className="search-results-header">
                            <span>Found {displayFiles.length} result(s)</span>
                            <button onClick={handleClearSearch} className="clear-search">
                                View All Files
                            </button>
                        </div>
                    )}

                    <FileUpload onUpload={handleUpload} />

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading your files...</p>
                        </div>
                    ) : displayFiles.length > 0 ? (
                        <FileList 
                            files={displayFiles} 
                            onFileDelete={handleFileDelete}
                            onFileUpdate={handleFileUpdate}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No files yet</h3>
                            <p>Start by uploading your first file above!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;