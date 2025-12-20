import React, { useState } from 'react';
import './EnhancedStats.css';

const EnhancedStats = ({ stats, files }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  const getStorageInfo = () => {
    const totalStorage = 100 * 1024 * 1024 * 1024; // 100 GB
    const usedMB = (parseFloat(stats.storageUsed) * 1024).toFixed(2);
    const remainingGB = (100 - parseFloat(stats.storageUsed)).toFixed(2);
    
    return {
      used: stats.storageUsed,
      remaining: remainingGB,
      total: '100 GB',
      percent: stats.storagePercent || 42
    };
  };

  const getFileTypeBreakdown = () => {
    const breakdown = {};
    files.forEach(file => {
      const ext = file.name.split('.').pop().toUpperCase();
      breakdown[ext] = (breakdown[ext] || 0) + 1;
    });
    return breakdown;
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    files.forEach(file => {
      const cat = file.category || 'Uncategorized';
      breakdown[cat] = (breakdown[cat] || 0) + 1;
    });
    return breakdown;
  };

  const getStorageBreakdown = () => {
    const breakdown = {};
    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!breakdown[ext]) breakdown[ext] = { count: 0, size: 0 };
      breakdown[ext].count += 1;
      breakdown[ext].size += (file.size || 0);
    });
    return breakdown;
  };

  const StatModal = ({ title, content, onClose }) => (
    <div className="stat-modal-overlay" onClick={onClose}>
      <div className="stat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stat-modal-header">
          <h2>{title}</h2>
          <button className="stat-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="stat-modal-content">
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="stats-grid">
        <h2 className="section-title">📊 Quick Statistics</h2>
        <div className="stats-cards">
          {/* Total Files Card */}
          <div 
            className="stat-card stat-card-1 stat-card-clickable"
            onClick={() => setSelectedStat({
              title: '📁 Total Files',
              type: 'files'
            })}
          >
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalFiles || files.length}</div>
              <div className="stat-label">Total Files</div>
              <div className="stat-meta">Click for details</div>
            </div>
            <div className="stat-hover">👆</div>
          </div>

          {/* Storage Used Card */}
          <div 
            className="stat-card stat-card-2 stat-card-clickable"
            onClick={() => setSelectedStat({
              title: '💾 Storage Usage',
              type: 'storage'
            })}
          >
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <div className="stat-value">{stats.storageUsed || '0.00'} GB</div>
              <div className="stat-label">Storage Used</div>
              <div className="stat-meta">{stats.storagePercent || 0}% Full</div>
            </div>
            <div className="stat-hover">👆</div>
          </div>

          {/* Categories Card */}
          <div 
            className="stat-card stat-card-3 stat-card-clickable"
            onClick={() => setSelectedStat({
              title: '🏷️ Categories',
              type: 'categories'
            })}
          >
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.categories || 5}</div>
              <div className="stat-label">Categories</div>
              <div className="stat-meta">Click for details</div>
            </div>
            <div className="stat-hover">👆</div>
          </div>

          {/* File Types Card */}
          <div 
            className="stat-card stat-card-4 stat-card-clickable"
            onClick={() => setSelectedStat({
              title: '📝 File Types',
              type: 'types'
            })}
          >
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.fileTypes || 3}</div>
              <div className="stat-label">File Types</div>
              <div className="stat-meta">Click for details</div>
            </div>
            <div className="stat-hover">👆</div>
          </div>
        </div>
      </section>

      {/* Modal for detailed information */}
      {selectedStat && (
        <StatModal
          title={selectedStat.title}
          onClose={() => setSelectedStat(null)}
          content={
            selectedStat.type === 'files' ? (
              <div className="stat-detail-content">
                <div className="detail-item">
                  <span className="detail-label">Total Files:</span>
                  <span className="detail-value">{stats.totalFiles || files.length}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Recent Files:</span>
                  <div className="file-list-detail">
                    {files.slice(0, 5).map((f, i) => (
                      <div key={i} className="file-detail-item">
                        📄 {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedStat.type === 'storage' ? (
              <div className="stat-detail-content">
                <div className="detail-item">
                  <span className="detail-label">Used Storage:</span>
                  <span className="detail-value">{getStorageInfo().used} GB</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Remaining Storage:</span>
                  <span className="detail-value">{getStorageInfo().remaining} GB</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Capacity:</span>
                  <span className="detail-value">{getStorageInfo().total}</span>
                </div>
                <div className="storage-progress-detail">
                  <div className="progress-bar-detail">
                    <div className="progress-fill-detail" style={{ width: `${getStorageInfo().percent}%` }}></div>
                  </div>
                  <span className="progress-text">{getStorageInfo().percent}% full</span>
                </div>
                <div className="detail-item">
                  <h4>Storage by File Type:</h4>
                  {Object.entries(getStorageBreakdown()).map(([type, data]) => (
                    <div key={type} className="storage-type-item">
                      <span>{type.toUpperCase()}: {data.count} files - {(data.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedStat.type === 'categories' ? (
              <div className="stat-detail-content">
                <div className="detail-item">
                  <span className="detail-label">Total Categories:</span>
                  <span className="detail-value">{stats.categories || 5}</span>
                </div>
                <div className="detail-item">
                  <h4>Files by Category:</h4>
                  {Object.entries(getCategoryBreakdown()).map(([cat, count]) => (
                    <div key={cat} className="category-item">
                      <span className="category-name">{cat}</span>
                      <span className="category-count">{count} files</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="stat-detail-content">
                <div className="detail-item">
                  <span className="detail-label">File Types:</span>
                  <span className="detail-value">{stats.fileTypes || 3}</span>
                </div>
                <div className="detail-item">
                  <h4>Files by Type:</h4>
                  {Object.entries(getFileTypeBreakdown()).map(([type, count]) => (
                    <div key={type} className="type-item">
                      <span className="type-name">{type}</span>
                      <span className="type-count">{count} files</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        />
      )}
    </>
  );
};

export default EnhancedStats;
