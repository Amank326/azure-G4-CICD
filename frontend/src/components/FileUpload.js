import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('notes', notes);

        setUploading(true);
        setUploadProgress(0);

        try {
            const response = await fetch('http://localhost:5000/api/files', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const newFile = await response.json();
            onUpload(newFile);
            setFile(null);
            setNotes('');
            setError('');
            setUploadProgress(100);
            
            setTimeout(() => {
                setUploadProgress(0);
            }, 1500);
            
        } catch (err) {
            setError(err.message || 'An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleSubmit}>
                <div
                    className={`upload-zone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    
                    {file ? (
                        <div className="file-selected">
                            <span className="file-icon">✓</span>
                            <div className="file-info">
                                <strong>{file.name}</strong>
                                <span className="file-size">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="upload-icon">📤</span>
                            <p className="upload-text">
                                Drag & drop your file here or click to browse
                            </p>
                            <p className="upload-subtext">
                                Supported: All file types
                            </p>
                        </>
                    )}
                </div>

                {file && (
                    <div className="form-section">
                        <textarea
                            className="notes-input"
                            id="notes"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add a description or notes for your file..."
                        ></textarea>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setNotes('');
                                }}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-upload"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    '⬆️ Upload File'
                                )}
                            </button>
                        </div>

                        {uploadProgress > 0 && (
                            <div className="progress-bar-wrapper">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{uploadProgress}%</span>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default FileUpload;
