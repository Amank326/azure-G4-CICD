import React, { useState } from 'react';
import './MyFiles.css';

const MyFiles = ({ files, onFileDelete, onFileUpdate }) => {
  const [sortBy, setSortBy] = useState('recent');

  const getSortedFiles = () => {
    const sorted = [...files];
    if (sortBy === 'recent') {
      return sorted.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    } else if (sortBy === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      return sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
    }
    return sorted;
  };

  const handleEdit = (file) => {
    const newName = prompt('Edit filename:', file.name);
    if (newName) {
      onFileUpdate({ ...file, name: newName });
    }
  };

  const handleDownload = (file) => {
    // Trigger download
    const link = document.createElement('a');
    link.href = file.url || '#';
    link.download = file.name;
    link.click();
  };

  return (
    <section className="my-files">
      <div className="my-files-header">
        <h2 className="section-title">📁 My Files & Notes</h2>
        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">Size</option>
          </select>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="no-files">
          <p>📭 No files uploaded yet. Start by uploading your first file!</p>
        </div>
      ) : (
        <>
          <h3 className="files-subheading">Your Files</h3>
          <div className="files-grid">
            {getSortedFiles().map((file, index) => (
              <div key={file.id} className="file-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="file-header">
                  <div className="file-type-icon">📄</div>
                  <h4 className="file-title">{file.name}</h4>
                </div>

                {file.size && (
                  <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                )}

                {file.description && (
                  <div className="file-notes">
                    <span className="notes-icon">📝</span>
                    <span className="notes-label">Notes</span>
                    <p className="notes-text">{file.description}</p>
                  </div>
                )}

                {file.uploadedAt && (
                  <p className="file-date">
                    📅 {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}

                <div className="file-actions">
                  <button 
                    className="btn btn-download"
                    onClick={() => handleDownload(file)}
                    title="Download"
                  >
                    📥 Download
                  </button>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(file)}
                    title="Edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => onFileDelete(file.id)}
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MyFiles;
