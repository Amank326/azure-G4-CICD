import React, { useState, useEffect } from 'react';
import './FileStats.css';

function FileStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search/stats/summary');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-loader">⏳ Loading statistics...</div>;
  }

  if (!stats) {
    return null;
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="stats-container">
      <h3 className="stats-title">📊 Dashboard</h3>
      
      <div className="stats-grid">
        <div className="stat-card total-files">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalFiles}</div>
            <div className="stat-label">Total Files</div>
          </div>
        </div>

        <div className="stat-card total-size">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-value">{formatBytes(stats.totalSize)}</div>
            <div className="stat-label">Total Size</div>
          </div>
        </div>

        <div className="stat-card file-types">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-value">{Object.keys(stats.byType).length}</div>
            <div className="stat-label">File Types</div>
          </div>
        </div>

        <div className="stat-card categories">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-value">{Object.keys(stats.byCategory).length}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      <div className="stats-details">
        <div className="detail-column">
          <h4>File Types</h4>
          <div className="detail-list">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="detail-item">
                <span className="detail-label">.{type}</span>
                <span className="detail-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-column">
          <h4>Categories</h4>
          <div className="detail-list">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="detail-item">
                <span className="detail-label">{category}</span>
                <span className="detail-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileStats;
