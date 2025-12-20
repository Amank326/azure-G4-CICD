import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    username: 'User Account',
    email: 'your.email@example.com',
    accountCreated: '21/12/2025',
    twoFactorAuth: false,
    emailNotifications: true,
    autoLockInactive: true,
    darkMode: true,
    autoOrganizeFiles: true,
    notificationSound: true,
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [animatingButton, setAnimatingButton] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async () => {
    setAnimatingButton('save');
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
    }
    setTimeout(() => setAnimatingButton(''), 300);
  };

  const handleResetSettings = () => {
    setAnimatingButton('reset');
    const defaultSettings = {
      username: 'User Account',
      email: 'your.email@example.com',
      accountCreated: '21/12/2025',
      twoFactorAuth: false,
      emailNotifications: true,
      autoLockInactive: true,
      darkMode: true,
      autoOrganizeFiles: true,
      notificationSound: true,
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    setSaveStatus('reset');
    setTimeout(() => setSaveStatus(''), 3000);
    setTimeout(() => setAnimatingButton(''), 300);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      alert('Account deletion would be processed here');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      localStorage.removeItem('appSettings');
      alert('All data cleared');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ User Settings & Account</h1>
      </div>

      <div className="settings-grid">
        {/* Account Information */}
        <section className="settings-card account-info-card">
          <div className="card-header">
            <h2>👤 Account Information</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                value={settings.username}
                onChange={handleInputChange}
                placeholder="Your username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountCreated">Account Created</label>
              <input 
                type="text" 
                id="accountCreated"
                name="accountCreated"
                value={settings.accountCreated}
                readOnly
                className="readonly-input"
              />
            </div>
            <button className="btn-primary" onClick={handleSaveSettings}>
              Update Profile
            </button>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="settings-card privacy-card">
          <div className="card-header">
            <h2>🔒 Privacy & Security</h2>
          </div>
          <div className="card-content">
            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Two-Factor Authentication</span>
                  <span className="toggle-description">Enhance account security</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle('twoFactorAuth')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Email Notifications</span>
                  <span className="toggle-description">Get notified about file activities</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Auto-lock Inactive</span>
                  <span className="toggle-description">Automatically lock after inactivity</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.autoLockInactive}
                    onChange={() => handleToggle('autoLockInactive')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-card preferences-card">
          <div className="card-header">
            <h2>⚡ Preferences</h2>
          </div>
          <div className="card-content">
            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Dark Mode</span>
                  <span className="toggle-description">Reduce eye strain</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Auto-organize Files</span>
                  <span className="toggle-description">Automatically categorize uploads</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.autoOrganizeFiles}
                    onChange={() => handleToggle('autoOrganizeFiles')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-label">
                  <span className="toggle-title">Enable Notifications Sound</span>
                  <span className="toggle-description">Play sound on new events</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={settings.notificationSound}
                    onChange={() => handleToggle('notificationSound')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-card danger-card">
          <div className="card-header danger-header">
            <h2>⚠️ Danger Zone</h2>
            <span className="danger-label">Irreversible Actions</span>
          </div>
          <div className="card-content">
            <button className="btn-danger btn-delete" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button className="btn-danger btn-clear-data" onClick={handleClearAllData}>
              Clear All Data
            </button>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className={`btn-save ${animatingButton === 'save' ? 'animating' : ''} ${saveStatus === 'saved' ? 'success' : ''}`}
          onClick={handleSaveSettings}
        >
          💾 Save All Settings
        </button>
        <button 
          className={`btn-reset ${animatingButton === 'reset' ? 'animating' : ''}`}
          onClick={handleResetSettings}
        >
          ↺ Reset to Default
        </button>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className={`status-message ${saveStatus}`}>
          {saveStatus === 'saved' && '✓ Settings saved successfully!'}
          {saveStatus === 'reset' && '↺ Settings reset to default!'}
          {saveStatus === 'error' && '✗ Error saving settings'}
        </div>
      )}
    </div>
  );
};

export default Settings;
