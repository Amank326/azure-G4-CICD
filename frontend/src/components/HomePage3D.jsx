import React, { useState, useEffect, Suspense } from 'react';
import Settings from './Settings';
import QuickActions from './QuickActions';
import AdvancedSearch from './AdvancedSearch';
import MyFiles from './MyFiles';
import Analytics from './Analytics';
import EnhancedStats from './EnhancedStats';
import { Background3D } from './3D';
import './HomePage3D.css';

const HomePage3D = () => {
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
      // Use mock data if API fails
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

  const handleFileUpload = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(file => {
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          description: '',
          category: 'Uploads'
        };
        setFiles([newFile, ...files]);
      });
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
    }
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
      case 'share':
        // Share - Copy share link to clipboard
        const shareLink = `${window.location.origin}?share=${Date.now()}`;
        navigator.clipboard.writeText(shareLink);
        alert('✅ Share link copied to clipboard!\n\n' + shareLink);
        break;
      case 'backup':
        // Backup - Export all files as JSON
        if (files.length === 0) {
          alert('❌ No files to backup!');
          break;
        }
        const backupData = {
          timestamp: new Date().toISOString(),
          totalFiles: files.length,
          files: files,
          stats: stats
        };
        const backupJson = JSON.stringify(backupData, null, 2);
        const blob = new Blob([backupJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Backup downloaded successfully!');
        break;
      case 'organize':
        // Organize - Group files by category
        const categories = new Map();
        files.forEach(file => {
          const cat = file.category || 'Uncategorized';
          if (!categories.has(cat)) {
            categories.set(cat, []);
          }
          categories.get(cat).push(file.name);
        });
        let organizeMsg = '📂 Files organized by category:\n\n';
        categories.forEach((fileList, cat) => {
          organizeMsg += `${cat} (${fileList.length} files)\n`;
          fileList.slice(0, 3).forEach(name => organizeMsg += `  • ${name}\n`);
          if (fileList.length > 3) organizeMsg += `  ... and ${fileList.length - 3} more\n`;
          organizeMsg += '\n';
        });
        alert(organizeMsg);
        break;
      case 'archive':
        // Archive - Create archive of all files
        if (files.length === 0) {
          alert('❌ No files to archive!');
          break;
        }
        const archiveData = {
          name: `Archive_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
          createdAt: new Date().toISOString(),
          fileCount: files.length,
          totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
          files: files.map(f => ({ name: f.name, size: f.size, date: f.uploadedAt }))
        };
        const archiveJson = JSON.stringify(archiveData, null, 2);
        const archiveBlob = new Blob([archiveJson], { type: 'application/json' });
        const archiveUrl = URL.createObjectURL(archiveBlob);
        const archiveLink = document.createElement('a');
        archiveLink.href = archiveUrl;
        archiveLink.download = `archive-${Date.now()}.json`;
        archiveLink.click();
        URL.revokeObjectURL(archiveUrl);
        alert(`✅ Archive created!\n\nTotal files: ${files.length}\nSize: ${(archiveData.totalSize / 1024 / 1024).toFixed(2)} MB`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="homepage-3d-container">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Background3D cameraZ={28} intensity={0.9}>
          {/* Sidebar - positioned absolutely over 3D */}
          <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">☁️</div>
          <h2>Cloud File &<br />Notes</h2>
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
            <h1 className="page-title">Cloud File & Notes <span className="highlight">Management</span></h1>
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
          {/* Hidden File Input */}
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

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
                      <div key={file.id} className="file-item">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <p className="file-name">{file.name}</p>
                          <p className="file-date">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="file-actions">
                          <button className="file-menu">⋯</button>
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
              <h2 className="section-title">📤 Upload Files & Add Notes</h2>
              <div className="upload-container">
                <label htmlFor="file-input" className="upload-area">
                  <div className="upload-icon">📁</div>
                  <p className="upload-text">Drag & drop your file here or click to browse</p>
                  <p className="upload-support">Supported: All file types</p>
                  {uploadProgress > 0 && (
                    <div className="upload-progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </label>
                {files.length > 0 && (
                  <div className="recent-uploads">
                    <h3>Recent Uploads</h3>
                    <ul>
                      {files.slice(0, 5).map(file => (
                        <li key={file.id}>{file.name}</li>
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
          {activeMenu === 'settings' && <Settings />}
        </div>
      </main>
        </Background3D>
      </Suspense>
    </div>
  );
};

export default HomePage3D;
