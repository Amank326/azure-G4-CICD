import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = ({ files }) => {
  const [analytics, setAnalytics] = useState({
    totalStorage: 0,
    usedStorage: 0,
    percentUsed: 0,
    totalFiles: 0,
    fileTypes: new Set(),
    categories: new Set(),
    last7Days: 0,
    last30Days: 0,
    allTime: 0,
    uploads: 0,
    downloads: 0,
    edits: 0,
  });

  useEffect(() => {
    calculateAnalytics();
  }, [files]);

  const calculateAnalytics = () => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let totalSize = 0;
    let last7Count = 0;
    let last30Count = 0;
    const fileTypeSet = new Set();
    const categorySet = new Set();

    files.forEach(file => {
      totalSize += file.size || 0;
      fileTypeSet.add(file.name.split('.').pop()?.toUpperCase() || 'Unknown');
      categorySet.add(file.category || 'Uncategorized');

      const fileDate = new Date(file.uploadedAt);
      if (fileDate >= last7Days) last7Count++;
      if (fileDate >= last30Days) last30Count++;
    });

    const maxStorage = 100 * 1024 * 1024 * 1024; // 100 GB
    const percentUsed = Math.min((totalSize / maxStorage) * 100, 100);

    setAnalytics({
      totalStorage: '100 GB',
      usedStorage: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
      percentUsed: percentUsed.toFixed(0),
      totalFiles: files.length,
      fileTypes: fileTypeSet,
      categories: categorySet,
      last7Days: last7Count,
      last30Days: last30Count,
      allTime: files.length,
      uploads: files.length,
      downloads: 0,
      edits: 0,
    });
  };

  return (
    <section className="analytics">
      <h2 className="section-title">📊 Storage & Usage Analytics</h2>

      <div className="analytics-grid">
        {/* Storage Usage Card */}
        <div className="analytics-card storage-card">
          <h3 className="card-title">💾 Storage Usage</h3>
          <div className="storage-content">
            <div className="storage-usage">
              <div className="storage-bar">
                <div 
                  className="storage-bar-fill"
                  style={{ width: `${analytics.percentUsed}%` }}
                ></div>
              </div>
              <div className="storage-info">
                <span className="storage-used">{analytics.usedStorage} GB used</span>
                <span className="storage-limit">Remaining</span>
              </div>
            </div>
            <p className="storage-percentage">{analytics.percentUsed}% of {analytics.totalStorage} used</p>
          </div>
        </div>

        {/* File Distribution Card */}
        <div className="analytics-card distribution-card">
          <h3 className="card-title">📁 File Distribution</h3>
          <div className="distribution-content">
            <div className="distribution-item">
              <span className="dist-label">Total Files:</span>
              <span className="dist-value">{analytics.totalFiles}</span>
            </div>
            <div className="distribution-item">
              <span className="dist-label">File Types:</span>
              <span className="dist-value">{analytics.fileTypes.size}</span>
            </div>
            <div className="distribution-item">
              <span className="dist-label">Categories:</span>
              <span className="dist-value">{analytics.categories.size}</span>
            </div>
          </div>
        </div>

        {/* Upload Timeline Card */}
        <div className="analytics-card timeline-card">
          <h3 className="card-title">📈 Upload Timeline</h3>
          <div className="timeline-content">
            <div className="timeline-item">
              <span className="timeline-label">Last 7 Days:</span>
              <span className="timeline-value">{analytics.last7Days} files</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">Last 30 Days:</span>
              <span className="timeline-value">{analytics.last30Days} files</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">All Time:</span>
              <span className="timeline-value">{analytics.allTime} files</span>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="analytics-card activity-card">
          <h3 className="card-title">👁️ Activity</h3>
          <div className="activity-content">
            <div className="activity-item">
              <span className="activity-icon">📤</span>
              <span className="activity-label">Uploads</span>
              <span className="activity-status active">Active</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📥</span>
              <span className="activity-label">Downloads</span>
              <span className="activity-status active">Active</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✏️</span>
              <span className="activity-label">Edits</span>
              <span className="activity-status active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
