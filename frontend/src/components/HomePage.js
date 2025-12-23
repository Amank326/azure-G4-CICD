import React, { useState, useEffect } from 'react';
import './HomePage.css';
import FileUpload from './FileUpload';
import FileList from './FileList';
import API_CONFIG from '../config';

const HomePage = ({ darkMode }) => {
    const [stats, setStats] = useState({ files: 0, storage: '0 GB', categories: 0, types: 0 });
    const [activeTab, setActiveTab] = useState('overview');
    const [files, setFiles] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [activeFileMenu, setActiveFileMenu] = useState(null);
    const [shareModal, setShareModal] = useState({ show: false, fileId: null, fileName: '' });
    
    // Settings State
    const [settings, setSettings] = useState({
        username: localStorage.getItem('userSettings_username') || 'User Account',
        email: localStorage.getItem('userSettings_email') || 'user@example.com',
        twoFactorAuth: localStorage.getItem('userSettings_2fa') === 'true' || false,
        emailNotifications: localStorage.getItem('userSettings_emailNotifications') === 'true' || true,
        autoLock: localStorage.getItem('userSettings_autoLock') === 'true' || true,
        darkModeEnabled: localStorage.getItem('userSettings_darkMode') === 'true' || false,
        autoOrganize: localStorage.getItem('userSettings_autoOrganize') === 'true' || true,
        notificationSound: localStorage.getItem('userSettings_notificationSound') === 'true' || true,
        accountCreated: localStorage.getItem('userSettings_accountCreated') || new Date().toLocaleDateString()
    });

    useEffect(() => {
        fetchFiles();
        fetchStats();
    }, []);

    const fetchFiles = async () => {
        try {
            console.log('📂 Fetching files from:', API_CONFIG.ENDPOINTS.LIST);
            const response = await fetch(API_CONFIG.ENDPOINTS.LIST, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            console.log('📡 Files fetch - Status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                const fileArray = Array.isArray(data) ? data : [];
                console.log('✅ Files loaded successfully:', fileArray.length, 'files');
                console.table(fileArray.slice(0, 3)); // Log first 3 files
                setFiles(fileArray);
                setRecentFiles(fileArray.slice(0, 6));
            } else {
                console.error('❌ Failed to fetch files:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                setFiles([]);
                setRecentFiles([]);
            }
        } catch (err) {
            console.error('❌ Error fetching files:', err.message);
            console.error('Stack:', err.stack);
            setFiles([]);
            setRecentFiles([]);
        }
    };

    const fetchStats = async () => {
        try {
            console.log('📊 Fetching stats from:', API_CONFIG.ENDPOINTS.LIST);
            const response = await fetch(API_CONFIG.ENDPOINTS.LIST, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                const fileArray = Array.isArray(data) ? data : [];
                let totalSize = 0;
                fileArray.forEach(file => {
                    totalSize += file.fileSize || 0;
                });
                const sizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
                const stats = {
                    files: fileArray.length || 0,
                    storage: `${sizeInGB} GB`,
                    categories: 5,
                    types: new Set(fileArray.map(f => f.name?.split('.').pop() || 'unknown')).size || 0
                };
                console.log('✅ Stats calculated:', stats);
                setStats(stats);
            }
        } catch (err) {
            console.error('❌ Error fetching stats:', err.message);
        }
    };

    const handleUpload = (newFile) => {
        setFiles([newFile, ...files]);
        setRecentFiles([newFile, ...recentFiles.slice(0, 5)]);
        fetchStats();
    };

    const handleFileDelete = (fileId) => {
        setFiles(files.filter(f => f.id !== fileId));
        setRecentFiles(recentFiles.filter(f => f.id !== fileId));
        fetchStats();
    };

    const handleFileUpdate = (updatedFile) => {
        setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
        setRecentFiles(recentFiles.map(f => f.id === updatedFile.id ? updatedFile : f));
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        
        const query = searchQuery.toLowerCase();
        const results = files.filter(f => 
            (f.name || f.filename || '').toLowerCase().includes(query) ||
            (f.notes || '').toLowerCase().includes(query)
        );
        setSearchResults(results);
        setShowSearchResults(true);
    };

    const handleQuickAction = (actionType) => {
        switch(actionType) {
            case 'upload':
                setActiveTab('upload');
                break;
            case 'search':
                setActiveTab('search');
                break;
            case 'organize':
                alert('Files are organized by date and type');
                break;
            case 'backup':
                alert('Auto-backup is enabled');
                break;
            case 'share':
                setShareModal({ show: true, fileId: null, fileName: 'Share Options' });
                break;
            case 'archive':
                alert('Archive feature coming soon!');
                break;
            default:
                break;
        }
    };

    const handleFileAction = (fileId, action) => {
        switch(action) {
            case 'download':
                alert('Downloading file...');
                setActiveFileMenu(null);
                break;
            case 'rename':
                alert('Rename feature coming soon!');
                setActiveFileMenu(null);
                break;
            case 'share':
                const fileToShare = files.find(f => f.id === fileId);
                setShareModal({ 
                    show: true, 
                    fileId: fileId, 
                    fileName: fileToShare?.name || 'File'
                });
                setActiveFileMenu(null);
                break;
            case 'delete':
                if(window.confirm('Are you sure you want to delete this file?')) {
                    handleFileDelete(fileId);
                    setActiveFileMenu(null);
                }
                break;
            case 'details':
                alert('Opening file details...');
                setActiveFileMenu(null);
                break;
            default:
                break;
        }
    };

    // Settings Functions
    const loadSettings = () => {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (err) {
            console.error('Error loading settings:', err);
        }
    };

    const handleSettingChange = (key, value) => {
        const updatedSettings = { ...settings, [key]: value };
        setSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    };

    const handleSaveSettings = () => {
        // Save individual settings to localStorage
        localStorage.setItem('userSettings_username', settings.username);
        localStorage.setItem('userSettings_email', settings.email);
        localStorage.setItem('userSettings_2fa', settings.twoFactorAuth);
        localStorage.setItem('userSettings_emailNotifications', settings.emailNotifications);
        localStorage.setItem('userSettings_autoLock', settings.autoLock);
        localStorage.setItem('userSettings_darkMode', settings.darkModeEnabled);
        localStorage.setItem('userSettings_autoOrganize', settings.autoOrganize);
        localStorage.setItem('userSettings_notificationSound', settings.notificationSound);
        localStorage.setItem('userSettings_accountCreated', settings.accountCreated);
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        alert('✅ All settings saved successfully!');
        console.log('Settings saved:', settings);
    };

    const handleResetSettings = () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            const defaultSettings = {
                username: 'User Account',
                email: 'user@example.com',
                twoFactorAuth: false,
                emailNotifications: true,
                autoLock: true,
                darkModeEnabled: false,
                autoOrganize: true,
                notificationSound: true,
                accountCreated: new Date().toLocaleDateString()
            };
            setSettings(defaultSettings);
            localStorage.clear();
            alert('✅ All settings reset to defaults');
        }
    };

    const handleUpdateProfile = () => {
        if (!settings.username.trim()) {
            alert('❌ Username cannot be empty');
            return;
        }
        if (!settings.email.trim() || !settings.email.includes('@')) {
            alert('❌ Please enter a valid email address');
            return;
        }
        handleSaveSettings();
    };

    const handleToggle2FA = () => {
        const newValue = !settings.twoFactorAuth;
        handleSettingChange('twoFactorAuth', newValue);
        if (newValue) {
            alert('✅ Two-Factor Authentication enabled');
        } else {
            alert('✅ Two-Factor Authentication disabled');
        }
    };

    const handleToggleEmailNotifications = () => {
        const newValue = !settings.emailNotifications;
        handleSettingChange('emailNotifications', newValue);
        alert(`✅ Email Notifications ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleToggleAutoLock = () => {
        const newValue = !settings.autoLock;
        handleSettingChange('autoLock', newValue);
        alert(`✅ Auto-lock ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleToggleDarkMode = () => {
        const newValue = !settings.darkModeEnabled;
        handleSettingChange('darkModeEnabled', newValue);
        alert(`✅ Dark Mode ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleToggleAutoOrganize = () => {
        const newValue = !settings.autoOrganize;
        handleSettingChange('autoOrganize', newValue);
        alert(`✅ Auto-organize Files ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleToggleNotificationSound = () => {
        const newValue = !settings.notificationSound;
        handleSettingChange('notificationSound', newValue);
        alert(`✅ Notification Sound ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm(
            '⚠️ WARNING: This will permanently delete your account and all associated data.\n\nType "DELETE" in the prompt to confirm.'
        );
        if (confirmation) {
            const userInput = prompt('Type "DELETE" to confirm account deletion:');
            if (userInput === 'DELETE') {
                // Clear all user data
                setFiles([]);
                setRecentFiles([]);
                setSettings({
                    username: 'User Account',
                    email: 'user@example.com',
                    twoFactorAuth: false,
                    emailNotifications: true,
                    autoLock: true,
                    darkModeEnabled: false,
                    autoOrganize: true,
                    notificationSound: true,
                    accountCreated: new Date().toLocaleDateString()
                });
                localStorage.clear();
                alert('❌ Account deleted successfully. Redirecting to login...');
                // In real app, would redirect to login page
                setActiveTab('overview');
            } else {
                alert('❌ Account deletion cancelled');
            }
        }
    };

    const handleClearAllData = () => {
        const confirmation = window.confirm(
            '⚠️ WARNING: This will permanently delete all your files and data.\n\nThis action cannot be undone.'
        );
        if (confirmation) {
            const userInput = prompt('Type "CLEAR ALL" to confirm:');
            if (userInput === 'CLEAR ALL') {
                // Delete all files from backend
                files.forEach(file => {
                    fetch(`http://localhost:5000/api/files/${file.id}`, {
                        method: 'DELETE'
                    }).catch(err => console.error('Error deleting file:', err));
                });
                
                setFiles([]);
                setRecentFiles([]);
                setStats({ files: 0, storage: '0 GB', categories: 0, types: 0 });
                alert('✅ All data cleared successfully');
                setActiveTab('overview');
            } else {
                alert('❌ Clear data cancelled');
            }
        }
    };

    const handleChangeUsername = (e) => {
        handleSettingChange('username', e.target.value);
    };

    const handleChangeEmail = (e) => {
        handleSettingChange('email', e.target.value);
    };

    return (
        <div className="home-page">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-badge">☁️</div>
                    <h2>Cloud File & Notes</h2>
                </div>

                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'files' ? 'active' : ''}`}
                        onClick={() => setActiveTab('files')}
                    >
                        <span className="nav-icon">📂</span>
                        <span>My Files</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <span className="nav-icon">🔍</span>
                        <span>Search</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <span className="nav-icon">⬆️</span>
                        <span>Upload</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <span className="nav-icon">📈</span>
                        <span>Analytics</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">👤</div>
                        <div>
                            <p className="username">User Account</p>
                            <p className="status">Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="page-header">
                    <div className="header-left">
                        <h1>Cloud File & Notes Management</h1>
                        <p>Upload files, add notes, and organize everything in one place</p>
                    </div>
                    <div className="header-right">
                        <input 
                            type="text" 
                            className="global-search"
                            placeholder="Search files globally..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="refresh-btn" onClick={() => {
                            fetchFiles();
                            fetchStats();
                        }}>🔄</button>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-content overview-tab">
                        {/* Statistics Cards */}
                        <section className="stats-section">
                            <h2>📊 Quick Statistics</h2>
                            <div className="stats-grid">
                                <div className="stat-card stat-1">
                                    <div className="stat-icon">📁</div>
                                    <div className="stat-info">
                                        <h3>{stats.files}</h3>
                                        <p>Total Files</p>
                                    </div>
                                    <div className="stat-trend">↑ 12%</div>
                                </div>

                                <div className="stat-card stat-2">
                                    <div className="stat-icon">💾</div>
                                    <div className="stat-info">
                                        <h3>{stats.storage}</h3>
                                        <p>Storage Used</p>
                                    </div>
                                    <div className="stat-trend">42% Full</div>
                                </div>

                                <div className="stat-card stat-3">
                                    <div className="stat-icon">🏷️</div>
                                    <div className="stat-info">
                                        <h3>{stats.categories}</h3>
                                        <p>Categories</p>
                                    </div>
                                    <div className="stat-trend">Organized</div>
                                </div>

                                <div className="stat-card stat-4">
                                    <div className="stat-icon">🎯</div>
                                    <div className="stat-info">
                                        <h3>{stats.types}</h3>
                                        <p>File Types</p>
                                    </div>
                                    <div className="stat-trend">Diverse</div>
                                </div>
                            </div>
                        </section>

                        {/* Recent Files */}
                        <section className="recent-files-section">
                            <h2>📝 Recent Files</h2>
                            <div className="files-showcase">
                                {recentFiles.length > 0 ? (
                                    recentFiles.map((file, index) => (
                                        <div key={index} className="file-item-home">
                                            <div className="file-icon">📄</div>
                                            <div className="file-details">
                                                <h4>{file.name || file.filename}</h4>
                                                <p>{new Date(file.createdAt || file.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="file-action-wrapper">
                                                <button 
                                                    className="file-action"
                                                    onClick={() => setActiveFileMenu(activeFileMenu === index ? null : index)}
                                                >
                                                    ⋯
                                                </button>
                                                {activeFileMenu === index && (
                                                    <div className="file-action-menu">
                                                        <button onClick={() => handleFileAction(file.id, 'download')} className="menu-item download-item">
                                                            📥 Download
                                                        </button>
                                                        <button onClick={() => handleFileAction(file.id, 'rename')} className="menu-item rename-item">
                                                            ✏️ Rename
                                                        </button>
                                                        <button onClick={() => handleFileAction(file.id, 'share')} className="menu-item share-item">
                                                            🔗 Share
                                                        </button>
                                                        <button onClick={() => handleFileAction(file.id, 'details')} className="menu-item details-item">
                                                            ℹ️ Details
                                                        </button>
                                                        <button onClick={() => handleFileAction(file.id, 'delete')} className="menu-item delete-item">
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-files">No files yet. Start uploading!</p>
                                )}
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="quick-actions">
                            <h2>⚡ Quick Actions</h2>
                            <div className="action-grid">
                                <button className="action-btn action-upload" onClick={() => handleQuickAction('upload')}>
                                    <span className="action-icon">📤</span>
                                    <span className="action-label">Upload File</span>
                                </button>
                                <button className="action-btn action-search" onClick={() => handleQuickAction('search')}>
                                    <span className="action-icon">🔍</span>
                                    <span className="action-label">Search Files</span>
                                </button>
                                <button className="action-btn action-share" onClick={() => handleQuickAction('share')}>
                                    <span className="action-icon">📤</span>
                                    <span className="action-label">Share Files</span>
                                </button>
                                <button className="action-btn action-backup" onClick={() => handleQuickAction('backup')}>
                                    <span className="action-icon">🔄</span>
                                    <span className="action-label">Backup</span>
                                </button>
                                <button className="action-btn action-organize" onClick={() => handleQuickAction('organize')}>
                                    <span className="action-icon">📂</span>
                                    <span className="action-label">Organize</span>
                                </button>
                                <button className="action-btn action-archive" onClick={() => handleQuickAction('archive')}>
                                    <span className="action-icon">🗜️</span>
                                    <span className="action-label">Archive</span>
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {/* Files Tab */}
                {activeTab === 'files' && (
                    <div className="tab-content">
                        <h2>📂 My Files & Notes</h2>
                        <FileList 
                            files={files} 
                            onFileDelete={handleFileDelete}
                            onFileUpdate={handleFileUpdate}
                        />
                    </div>
                )}

                {/* Search Tab */}
                {activeTab === 'search' && (
                    <div className="tab-content search-tab">
                        <h2>🔍 Advanced Global Search</h2>
                        <div className="search-panel-advanced">
                            <div className="search-controls">
                                <input 
                                    type="text" 
                                    className="search-input-advanced"
                                    placeholder="Search by filename, notes, or content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <select className="category-filter-advanced">
                                    <option>All Types</option>
                                    <option>Documents</option>
                                    <option>Images</option>
                                    <option>Videos</option>
                                    <option>Audio</option>
                                    <option>Other</option>
                                </select>
                                <button className="search-btn-advanced" onClick={handleSearch}>
                                    🔎 Search
                                </button>
                            </div>

                            {showSearchResults && (
                                <div className="search-results">
                                    <h3>Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</h3>
                                    {searchResults.length > 0 ? (
                                        <div className="results-grid">
                                            {searchResults.map((file, idx) => (
                                                <div key={idx} className="search-result-item">
                                                    <div className="result-icon">📄</div>
                                                    <div className="result-info">
                                                        <h4>{file.name || file.filename}</h4>
                                                        <p className="result-notes">{file.notes || 'No notes'}</p>
                                                        <p className="result-date">{new Date(file.createdAt || file.uploadedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-results">No files match your search</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload Tab */}
                {activeTab === 'upload' && (
                    <div className="tab-content">
                        <h2>📤 Upload Files & Add Notes</h2>
                        <FileUpload onUpload={handleUpload} />
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="tab-content analytics-tab">
                        <h2>📈 Storage & Usage Analytics</h2>
                        <div className="analytics-grid">
                            <div className="chart-card">
                                <h3>📊 Storage Usage</h3>
                                <div className="storage-bar">
                                    <div className="storage-used" style={{width: '35%'}}>
                                        <span>{stats.storage} used</span>
                                    </div>
                                    <div className="storage-free">
                                        <span>Remaining</span>
                                    </div>
                                </div>
                                <p className="storage-info">35% of 100 GB used</p>
                            </div>

                            <div className="chart-card">
                                <h3>📁 File Distribution</h3>
                                <div className="file-stats">
                                    <div className="stat-row">
                                        <span>Total Files:</span>
                                        <strong>{stats.files}</strong>
                                    </div>
                                    <div className="stat-row">
                                        <span>File Types:</span>
                                        <strong>{stats.types}</strong>
                                    </div>
                                    <div className="stat-row">
                                        <span>Categories:</span>
                                        <strong>{stats.categories}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3>📅 Upload Timeline</h3>
                                <div className="timeline-data">
                                    <p>Last 7 Days: <strong>{Math.floor(Math.random() * 10)}</strong> files</p>
                                    <p>Last 30 Days: <strong>{Math.floor(Math.random() * 50)}</strong> files</p>
                                    <p>All Time: <strong>{stats.files}</strong> files</p>
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3>🎯 Activity</h3>
                                <div className="activity-feed">
                                    <div className="activity-item">
                                        <span>🆙 Uploads</span>
                                        <strong>Active</strong>
                                    </div>
                                    <div className="activity-item">
                                        <span>📥 Downloads</span>
                                        <strong>Active</strong>
                                    </div>
                                    <div className="activity-item">
                                        <span>✏️ Edits</span>
                                        <strong>Active</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="tab-content settings-tab">
                        <h2>⚙️ User Settings & Account</h2>
                        <div className="settings-grid">
                            <div className="settings-section account-section">
                                <h3>👤 Account Information</h3>
                                <div className="setting-item">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        placeholder="Your Username" 
                                        value={settings.username}
                                        onChange={handleChangeUsername}
                                    />
                                </div>
                                <div className="setting-item">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="your.email@example.com"
                                        value={settings.email}
                                        onChange={handleChangeEmail}
                                    />
                                </div>
                                <div className="setting-item">
                                    <label>Account Created</label>
                                    <input 
                                        type="text" 
                                        placeholder="Date" 
                                        value={settings.accountCreated}
                                        disabled 
                                    />
                                </div>
                                <button className="btn-update" onClick={handleUpdateProfile}>Update Profile</button>
                            </div>

                            <div className="settings-section privacy-section">
                                <h3>🔒 Privacy & Security</h3>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Two-Factor Authentication</label>
                                        <small>Enhance account security</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.twoFactorAuth}
                                        onChange={handleToggle2FA}
                                    />
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Email Notifications</label>
                                        <small>Get notified about file activities</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={handleToggleEmailNotifications}
                                    />
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Auto-lock Inactive</label>
                                        <small>Automatically lock after inactivity</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.autoLock}
                                        onChange={handleToggleAutoLock}
                                    />
                                </div>
                            </div>

                            <div className="settings-section preferences-section">
                                <h3>⚡ Preferences</h3>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Dark Mode</label>
                                        <small>Reduce eye strain</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.darkModeEnabled}
                                        onChange={handleToggleDarkMode}
                                    />
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Auto-organize Files</label>
                                        <small>Automatically categorize uploads</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.autoOrganize}
                                        onChange={handleToggleAutoOrganize}
                                    />
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-label">
                                        <label>Enable Notifications Sound</label>
                                        <small>Play sound on new events</small>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle-checkbox"
                                        checked={settings.notificationSound}
                                        onChange={handleToggleNotificationSound}
                                    />
                                </div>
                            </div>

                            <div className="settings-section danger-section">
                                <h3>⚠️ Danger Zone</h3>
                                <p className="danger-text">Irreversible actions</p>
                                <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                                <button className="btn-danger" onClick={handleClearAllData}>Clear All Data</button>
                            </div>
                        </div>
                        <div className="settings-footer">
                            <button className="btn-save" onClick={handleSaveSettings}>💾 Save All Settings</button>
                            <button className="btn-reset" onClick={handleResetSettings}>↩️ Reset to Default</button>
                        </div>
                    </div>
                )}

                {/* Share Modal */}
                {shareModal.show && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.98) 0%, rgba(45, 27, 61, 0.95) 100%)',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            borderRadius: '12px',
                            padding: '30px',
                            minWidth: '400px',
                            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)'
                        }}>
                            <h2 style={{ color: '#00D4FF', marginBottom: '20px', marginTop: 0 }}>
                                📤 Share: {shareModal.fileName}
                            </h2>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ color: '#fff', fontSize: '13px', marginBottom: '15px' }}>
                                    Share this file with others:
                                </p>
                                
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    marginBottom: '15px'
                                }}>
                                    <button onClick={() => {
                                        const shareText = `Check out this file: ${shareModal.fileName}`;
                                        navigator.clipboard.writeText(shareText);
                                        alert('Share text copied to clipboard!');
                                    }} style={{
                                        padding: '10px',
                                        background: 'rgba(0, 212, 255, 0.2)',
                                        border: '1px solid rgba(0, 212, 255, 0.3)',
                                        borderRadius: '6px',
                                        color: '#00D4FF',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(0, 212, 255, 0.3)';
                                        e.target.style.borderColor = '#00D4FF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(0, 212, 255, 0.2)';
                                        e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                                    }}>
                                        📋 Copy Link
                                    </button>
                                    
                                    <button onClick={() => {
                                        const subject = `Shared: ${shareModal.fileName}`;
                                        const body = `I've shared a file with you: ${shareModal.fileName}%0ADownload it here: http://localhost:3000`;
                                        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                    }} style={{
                                        padding: '10px',
                                        background: 'rgba(131, 56, 236, 0.2)',
                                        border: '1px solid rgba(131, 56, 236, 0.3)',
                                        borderRadius: '6px',
                                        color: '#8338EC',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(131, 56, 236, 0.3)';
                                        e.target.style.borderColor = '#8338EC';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(131, 56, 236, 0.2)';
                                        e.target.style.borderColor = 'rgba(131, 56, 236, 0.3)';
                                    }}>
                                        📧 Email
                                    </button>

                                    <button onClick={() => {
                                        const text = `${shareModal.fileName} shared via Cloud File Manager`;
                                        navigator.clipboard.writeText(text);
                                        alert('File name copied to clipboard!');
                                    }} style={{
                                        padding: '10px',
                                        background: 'rgba(255, 0, 110, 0.2)',
                                        border: '1px solid rgba(255, 0, 110, 0.3)',
                                        borderRadius: '6px',
                                        color: '#FF006E',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 110, 0.3)';
                                        e.target.style.borderColor = '#FF006E';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 110, 0.2)';
                                        e.target.style.borderColor = 'rgba(255, 0, 110, 0.3)';
                                    }}>
                                        📌 Copy Name
                                    </button>

                                    <button onClick={() => {
                                        const tweetText = `Check out ${shareModal.fileName} - shared via Cloud File Manager! #filemanagement`;
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`);
                                    }} style={{
                                        padding: '10px',
                                        background: 'rgba(29, 155, 240, 0.2)',
                                        border: '1px solid rgba(29, 155, 240, 0.3)',
                                        borderRadius: '6px',
                                        color: '#1D9BF0',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(29, 155, 240, 0.3)';
                                        e.target.style.borderColor = '#1D9BF0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(29, 155, 240, 0.2)';
                                        e.target.style.borderColor = 'rgba(29, 155, 240, 0.3)';
                                    }}>
                                        𝕏 Tweet
                                    </button>
                                </div>

                                <div style={{
                                    background: 'rgba(0, 212, 255, 0.05)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    marginBottom: '15px'
                                }}>
                                    <p style={{ color: '#00D4FF', fontSize: '12px', margin: '0 0 5px 0', fontWeight: '600' }}>
                                        Share Link:
                                    </p>
                                    <input 
                                        type="text" 
                                        value={`http://localhost:3000?file=${shareModal.fileId}`}
                                        readOnly
                                        onClick={(e) => {
                                            e.target.select();
                                            navigator.clipboard.writeText(e.target.value);
                                            alert('Link copied!');
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: 'rgba(0, 212, 255, 0.08)',
                                            border: '1px solid rgba(0, 212, 255, 0.2)',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            fontFamily: 'monospace'
                                        }}
                                    />
                                </div>
                            </div>

                            <button onClick={() => setShareModal({ show: false, fileId: null, fileName: '' })} style={{
                                width: '100%',
                                padding: '10px',
                                background: 'linear-gradient(135deg, #00D4FF, #8338EC)',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#000',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                                ✓ Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
