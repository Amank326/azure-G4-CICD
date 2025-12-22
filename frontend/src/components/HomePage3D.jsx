import React, { useState, useEffect, Suspense } from 'react';
import Settings from './Settings';
import QuickActions from './QuickActions';
import AdvancedSearch from './AdvancedSearch';
import MyFiles from './MyFiles';
import Analytics from './Analytics';
import EnhancedStats from './EnhancedStats';
import AICMFeatures from './AICMFeatures';
import AICMFooter from './AICMFooter';
import { Background3D } from './3D';
import { useAICMAnimations } from './3D/useAICMAnimations';
import './HomePage3D.css';

const HomePage3D = ({ darkMode, setDarkMode }) => {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    storageUsed: '0.00',
    categories: 0,
    fileTypes: 0,
    storagePercent: 0
  });
  const [activeMenu, setActiveMenu] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLanding, setShowLanding] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [selectedFileForNote, setSelectedFileForNote] = useState(null);

  // Use AICM Animations
  useAICMAnimations();

  useEffect(() => {
    fetchFiles();
    fetchStats();
    const interval = setInterval(() => {
      fetchFiles();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data || []);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setFiles([
        { id: '1', name: 'Sample Document.pdf', size: 1024000, uploadedAt: new Date().toISOString(), description: 'Sample file for demonstration', category: 'Documents' },
        { id: '2', name: 'need_for_speed_heat_video_game_2-wallpaper-1920x1080 (1).jpg', size: 2048000, uploadedAt: new Date(Date.now() - 86400000).toISOString(), description: '', category: 'Images' },
        { id: '3', name: 'ticket.pdf', size: 512000, uploadedAt: new Date(Date.now() - 172800000).toISOString(), description: '', category: 'Documents' },
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        totalFiles: files.length,
        storageUsed: (files.reduce((sum, f) => sum + (f.size || 0), 0) / (1024 * 1024 * 1024)).toFixed(2),
        categories: new Set(files.map(f => f.category)).size,
        fileTypes: new Set(files.map(f => f.name.split('.').pop())).size,
        storagePercent: 42
      });
    }
  };

  const getRecentFiles = () => {
    return files.slice(0, 5);
  };

  const handleFileDelete = async (fileId) => {
    try {
      await fetch(`http://localhost:5000/api/files/${fileId}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setFiles(files.filter(f => f.id !== fileId));
    }
  };

  const handleFileUpdate = (updatedFile) => {
    setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('notes', document.getElementById('notes-input')?.value || '');

          setUploadProgress(50);
          const response = await fetch('http://localhost:5000/api/files', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const uploadedFile = await response.json();
            setFiles([uploadedFile, ...files]);
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1500);
            alert('✅ File uploaded successfully!');
            document.getElementById('notes-input').value = '';
          } else {
            alert('❌ Failed to upload file');
            setUploadProgress(0);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('❌ Error uploading file: ' + error.message);
          setUploadProgress(0);
        }
      });
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${file.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ File downloaded successfully!');
      } else {
        alert('❌ Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ Error downloading file: ' + error.message);
    }
    setOpenMenuId(null);
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setFiles(files.filter(f => f.id !== fileId));
          alert('✅ File deleted successfully!');
        } else {
          alert('❌ Failed to delete file');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Error deleting file: ' + error.message);
      }
    }
    setOpenMenuId(null);
  };

  const addNote = (noteText, fileId) => {
    if (!noteText.trim()) {
      alert('⚠️ Please enter a note!');
      return;
    }
    const newNote = {
      id: Date.now(),
      text: noteText,
      fileId: fileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    document.getElementById('notes-input').value = '';
    alert('✅ Note created successfully!');
  };

  const updateNote = (noteId, noteText) => {
    if (!noteText.trim()) {
      alert('⚠️ Please enter a note!');
      return;
    }
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, text: noteText, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNoteId(null);
    alert('✅ Note updated successfully!');
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      alert('✅ Note deleted successfully!');
    }
  };

  const getNotesForFile = (fileId) => {
    return notes.filter(note => note.fileId === fileId);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'upload':
        setActiveMenu('upload');
        document.getElementById('file-input')?.click();
        break;
      case 'search':
        setActiveMenu('search');
        break;
      case 'notes':
        setActiveMenu('upload');
        setTimeout(() => document.getElementById('notes-input')?.focus(), 100);
        break;
      case 'analytics':
        setActiveMenu('analytics');
        break;
      default:
        break;
    }
  };

  // AICM Landing Page View
  if (showLanding) {
    return (
      <div style={{ width: '100%', overflow: 'auto', background: 'linear-gradient(135deg, #0f0e1e 0%, #1a1a3e 25%, #0d3b66 50%, #1a1a3e 75%, #0f0e1e 100%)' }}>
        <Suspense fallback={null}>
          <Background3D cameraZ={22} intensity={1.2}>
          <div className="landing-hero-container">
            {/* Navigation */}
            <nav className="landing-nav">
              <div className="nav-logo">
                <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '1px' }}>File Management</h2>
              </div>
            </nav>

            {/* Hero Section */}
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="gradient-text">Cloud</span> <span className="gradient-text">File Management</span>
                </h1>
                <p className="hero-subtitle" style={{ color: '#e0e0e0' }}>
                  Experience intelligent file organization with stunning 3D visualization. 
                  Manage, search, and organize your files effortlessly.
                </p>

                {/* CTA Buttons */}
                <div className="hero-cta-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => setShowLanding(false)}
                  >
                    Ready to Transform Your File Management
                  </button>
                </div>

                {/* Stats */}
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number" style={{ color: '#00d4ff' }}>{stats.totalFiles}+</span>
                    <span className="stat-label" style={{ color: '#ffffff' }}>Files Stored</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number" style={{ color: '#00d4ff' }}>{stats.storageUsed}</span>
                    <span className="stat-label" style={{ color: '#ffffff' }}>GB Used</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number" style={{ color: '#00d4ff' }}>{stats.categories}</span>
                    <span className="stat-label" style={{ color: '#ffffff' }}>Categories</span>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="scroll-indicator">
                <div className="mouse">
                  <div className="wheel"></div>
                </div>
                <p>Scroll to explore</p>
              </div>
            </div>
          </div>
        </Background3D>
        </Suspense>

        {/* Features Section */}
        <AICMFeatures stats={stats} />

        {/* Footer Section */}
        <AICMFooter onGetStarted={() => setShowLanding(false)} />
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="homepage-3d-container">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Background3D cameraZ={28} intensity={0.9}>
          {/* Sidebar - positioned absolutely over 3D */}
          <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon animated-cloud">☁️</div>
          <h2 style={{ color: '#ffffff' }}>Cloud File<br />Management</h2>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveMenu('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Overview</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'files' ? 'active' : ''}`}
            onClick={() => setActiveMenu('files')}
          >
            <span className="nav-icon">📁</span>
            <span className="nav-text">My Files</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'search' ? 'active' : ''}`}
            onClick={() => setActiveMenu('search')}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Search</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveMenu('upload')}
          >
            <span className="nav-icon">📤</span>
            <span className="nav-text">Upload</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveMenu('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-account">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <p className="user-name">User Account</p>
              <p className="user-status">Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title gradient-title">Cloud File & Notes <span className="highlight">Management</span></h1>
            <p className="page-subtitle">Upload files, add notes, and organize everything in one place</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search files globally..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">

          {/* Overview Tab */}
          {activeMenu === 'overview' && (
            <>
              {/* Enhanced Interactive Statistics */}
              <EnhancedStats stats={stats} files={files} />

              {/* Recent Files */}
              <section className="recent-files">
                <h2 className="section-title">📄 Recent Files</h2>
                <div className="files-list">
                  {getRecentFiles().length === 0 ? (
                    <div className="no-files-message">
                      <p>No files yet. Start by uploading your first file!</p>
                    </div>
                  ) : (
                    getRecentFiles().map((file) => (
                      <div key={file.id} className="file-item" style={{ position: 'relative' }}>
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <p className="file-name">{file.name}</p>
                          <p className="file-date">{new Date(file.createdAt || file.uploadedAt).toLocaleDateString()}</p>
                          {file.notes && <p style={{ color: '#00d4ff', fontSize: '12px', marginTop: '5px' }}>📝 {file.notes}</p>}
                        </div>
                        <div className="file-actions">
                          <button 
                            className="file-menu"
                            onClick={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                            style={{ position: 'relative' }}
                          >
                            ⋯
                          </button>
                          {openMenuId === file.id && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              background: 'rgba(13, 59, 102, 0.95)',
                              border: '1px solid #00d4ff',
                              borderRadius: '6px',
                              boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
                              zIndex: 1000,
                              minWidth: '150px'
                            }}>
                              <button 
                                onClick={() => handleDownloadFile(file)}
                                style={{
                                  width: '100%',
                                  padding: '10px 15px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#ffffff',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(0, 212, 255, 0.2)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                              >
                                📥 Download
                              </button>
                              <button 
                                onClick={() => handleDeleteFile(file.id)}
                                style={{
                                  width: '100%',
                                  padding: '10px 15px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#ff6b6b',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  transition: 'all 0.2s',
                                  borderTop: '1px solid #00d4ff'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.2)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Quick Actions */}
              <QuickActions onAction={handleQuickAction} />
            </>
          )}

          {/* Search Tab */}
          {activeMenu === 'search' && (
            <AdvancedSearch files={files} />
          )}

          {/* My Files Tab */}
          {activeMenu === 'files' && (
            <MyFiles 
              files={files}
              onFileDelete={handleFileDelete}
              onFileUpdate={handleFileUpdate}
            />
          )}

          {/* Upload Tab */}
          {activeMenu === 'upload' && (
            <section className="upload-section">
              <h2 className="section-title">📤 Upload Files & Add Cloud Notes</h2>
              <div className="upload-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* File Upload Area */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept="*/*"
                    />
                    <label htmlFor="file-input" className="upload-area" style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="upload-icon">📁</div>
                      <p className="upload-text">Click to upload or drag files here</p>
                      <p className="upload-support">Supported: All file types</p>
                      {uploadProgress > 0 && (
                        <div className="upload-progress-bar">
                          <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Advanced Cloud Notes Area */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>📝 Cloud Notes</label>
                    <textarea
                      id="notes-input"
                      placeholder="Write your important notes here... You can add notes for your files or create standalone notes."
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #00d4ff',
                        backgroundColor: 'rgba(13, 59, 102, 0.6)',
                        color: '#ffffff',
                        fontFamily: 'inherit',
                        resize: 'none',
                        minHeight: '120px',
                        fontSize: '14px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => addNote(document.getElementById('notes-input')?.value || '', null)}
                        style={{
                          flex: 1,
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#00d4ff',
                          color: '#000000',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        ✔️ Save Note
                      </button>
                      <button
                        onClick={() => document.getElementById('notes-input').value = ''}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: '1px solid #00d4ff',
                          backgroundColor: 'transparent',
                          color: '#00d4ff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(0, 212, 255, 0.1)'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                      >
                        🗑️ Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* All Notes Section */}
                {notes.length > 0 && (
                  <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(13, 59, 102, 0.3)', borderRadius: '8px', border: '1px solid #00d4ff' }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>📋 All Notes ({notes.length})</h3>
                    <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                      {notes.map((note) => (
                        <div key={note.id} style={{ padding: '12px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '6px', border: '1px solid #00d4ff' }}>
                          {editingNoteId === note.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <textarea
                                defaultValue={note.text}
                                id={`edit-note-${note.id}`}
                                style={{
                                  padding: '10px',
                                  borderRadius: '6px',
                                  border: '1px solid #00d4ff',
                                  backgroundColor: 'rgba(13, 59, 102, 0.8)',
                                  color: '#ffffff',
                                  fontFamily: 'inherit',
                                  resize: 'none',
                                  minHeight: '80px'
                                }}
                              />
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                  onClick={() => updateNote(note.id, document.getElementById(`edit-note-${note.id}`)?.value || '')}
                                  style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: '#00d4ff',
                                    color: '#000000',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                  }}
                                >
                                  💾 Save
                                </button>
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: 'transparent',
                                    color: '#00d4ff',
                                    border: '1px solid #00d4ff',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                  }}
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p style={{ color: '#e0e0e0', marginBottom: '8px', fontSize: '14px' }}>{note.text}</p>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => setEditingNoteId(note.id)}
                                  style={{
                                    padding: '5px 12px',
                                    background: 'transparent',
                                    color: '#00d4ff',
                                    border: '1px solid #00d4ff',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => deleteNote(note.id)}
                                  style={{
                                    padding: '5px 12px',
                                    background: 'transparent',
                                    color: '#ff6b6b',
                                    border: '1px solid #ff6b6b',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                              <p style={{ color: '#00d4ff', fontSize: '11px', marginTop: '8px' }}>{new Date(note.updatedAt).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Uploads List */}
                {files.length > 0 && (
                  <div className="recent-uploads" style={{ marginTop: '30px', padding: '20px', background: 'rgba(13, 59, 102, 0.3)', borderRadius: '8px', border: '1px solid #00d4ff' }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>📋 Recent Uploads ({files.length})</h3>
                    <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                      {files.slice(0, 10).map(file => (
                        <li key={file.id} style={{ padding: '10px', background: 'rgba(0, 212, 255, 0.1)', marginBottom: '8px', borderRadius: '6px', color: '#ffffff', borderLeft: '3px solid #00d4ff' }}>
                          <strong>{file.name}</strong>
                          {file.notes && <p style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '5px' }}>📝 {file.notes}</p>}
                          <p style={{ color: '#00d4ff', fontSize: '12px', marginTop: '5px' }}>{new Date(file.createdAt).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Analytics Tab */}
          {activeMenu === 'analytics' && <Analytics files={files} />}

          {/* Settings Tab */}
          {activeMenu === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
        </div>
      </main>
      </Background3D>
      </Suspense>
    </div>
  );
};

export default HomePage3D;
