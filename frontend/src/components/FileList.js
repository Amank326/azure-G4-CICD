import React, { useState } from 'react';
import API_CONFIG from '../config';
import './FileList.css';

const FileList = ({ files, onFileDelete, onFileUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editingNotes, setEditingNotes] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('recent');

    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        const icons = {
            'pdf': '📄', 'doc': '📝', 'docx': '📝',
            'xls': '📊', 'xlsx': '📊', 'csv': '📊',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
            'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️',
            'mp4': '🎥', 'avi': '🎥', 'mov': '🎥',
            'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
            'txt': '📃', 'json': '⚙️', 'xml': '⚙️',
        };
        return icons[ext] || '📎';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sortedFiles = [...files].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return (a.name || '').localeCompare(b.name || '');
            case 'size':
                return (a.fileSize || 0) - (b.fileSize || 0);
            case 'recent':
            default:
                return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        }
    });

    const handleDownload = (fileId, fileName) => {
        window.location.href = API_CONFIG.ENDPOINTS.GET(fileId);
    };

    const handleEdit = (file) => {
        setEditingId(file.id);
        setEditingNotes(file.notes || '');
    };

    const handleSaveEdit = async (fileId) => {
        setLoading(true);
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.GET(fileId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes: editingNotes }),
            });

            if (!response.ok) {
                throw new Error('Failed to update notes');
            }

            const updatedFile = await response.json();
            if (onFileUpdate) {
                onFileUpdate(updatedFile);
            }
            setEditingId(null);
            setEditingNotes('');
        } catch (err) {
            setError(err.message || 'Failed to update notes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            setLoading(true);
            try {
                const response = await fetch(API_CONFIG.ENDPOINTS.DELETE(fileId), {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete file');
                }

                if (onFileDelete) {
                    onFileDelete(fileId);
                }
            } catch (err) {
                setError(err.message || 'Failed to delete file');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="files-container">
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            <div className="files-header">
                <h2 className="files-title">📂 Your Files</h2>
                <div className="sort-controls">
                    <label htmlFor="sort">Sort by:</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="size">File Size</option>
                    </select>
                </div>
            </div>

            <div className="files-grid">
                {sortedFiles.map((file, index) => (
                    <div
                        key={file.id}
                        className="file-card"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="file-card-header">
                            <span className="file-type-icon">{getFileIcon(file.name)}</span>
                            <div className="file-name-wrapper">
                                <h3 className="file-name">{file.name}</h3>
                                <span className="file-size">{formatFileSize(file.fileSize)}</span>
                            </div>
                        </div>

                        <div className="file-card-body">
                            {editingId === file.id ? (
                                <div className="edit-mode">
                                    <textarea
                                        className="edit-textarea"
                                        rows="3"
                                        value={editingNotes}
                                        onChange={(e) => setEditingNotes(e.target.value)}
                                        placeholder="Add or edit notes..."
                                    />
                                    <div className="edit-buttons">
                                        <button
                                            className="btn-save"
                                            onClick={() => handleSaveEdit(file.id)}
                                            disabled={loading}
                                        >
                                            💾 Save
                                        </button>
                                        <button
                                            className="btn-cancel-edit"
                                            onClick={() => setEditingId(null)}
                                            disabled={loading}
                                        >
                                            ✕ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="file-notes">
                                        {file.notes ? (
                                            <>
                                                <label className="notes-label">📝 Notes</label>
                                                <p className="notes-text">{file.notes}</p>
                                            </>
                                        ) : (
                                            <p className="no-notes">No notes added</p>
                                        )}
                                    </div>

                                    <div className="file-meta">
                                        <span className="meta-item">📅 {formatDate(file.updatedAt || file.createdAt)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="file-card-footer">
                            <button
                                className="btn-action btn-download"
                                onClick={() => handleDownload(file.id, file.name)}
                                title="Download file"
                            >
                                ⬇️ Download
                            </button>
                            <button
                                className="btn-action btn-edit"
                                onClick={() => handleEdit(file)}
                                disabled={editingId === file.id}
                                title="Edit notes"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn-action btn-delete"
                                onClick={() => handleDelete(file.id)}
                                disabled={loading}
                                title="Delete file"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
