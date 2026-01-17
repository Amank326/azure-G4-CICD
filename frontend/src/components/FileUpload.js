import React, { useState, useRef } from 'react';
import API_CONFIG from '../config';
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

    // Retry logic with exponential backoff
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`\n📤 Attempt ${attempt}/${maxRetries}...`);
                
                const fetchPromise = fetch(url, {
                    ...options,
                    signal: AbortSignal.timeout(15000), // 15 second timeout per attempt
                });
                
                const response = await fetchPromise;
                console.log(`✅ Response received: ${response.status} ${response.statusText}`);
                return response;
                
            } catch (err) {
                lastError = err;
                console.warn(`⚠️  Attempt ${attempt} failed:`, err.message);
                
                if (attempt < maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s
                    const delayMs = Math.pow(2, attempt - 1) * 1000;
                    console.log(`⏳ Retrying in ${delayMs}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }
        
        throw lastError || new Error('Upload failed after all retry attempts');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        // Get userId from localStorage (or use default)
        const userId = localStorage.getItem('userId') || 'user_' + Date.now();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('description', notes);
        formData.append('tags', 'web-upload');

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadUrl = API_CONFIG.ENDPOINTS.UPLOAD;
            const startTime = performance.now();
            
            console.log('═══════════════════════════════════════');
            console.log('🚀 FILE UPLOAD INITIATED');
            console.log('═══════════════════════════════════════');
            console.log('📤 Upload URL:', uploadUrl);
            console.log('📦 File Info:');
            console.log('   Name:', file.name);
            console.log('   Size:', (file.size / 1024).toFixed(2), 'KB');
            console.log('   Type:', file.type);
            console.log('👤 User ID:', userId);
            console.log('📝 Description:', notes);
            console.log('🏷️  Tags: web-upload');
            console.log('═══════════════════════════════════════');
            
            // Check backend health before uploading
            console.log('\n🔍 Checking backend health...');
            try {
                const healthUrl = API_CONFIG.ENDPOINTS.HEALTH;
                const healthResponse = await fetch(healthUrl, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000),
                });
                console.log('✅ Backend is healthy:', healthResponse.status);
            } catch (healthErr) {
                console.warn('⚠️  Backend health check failed:', healthErr.message);
                setError('⚠️  Backend service is not responding. The backend might be temporarily unavailable. Please try again in a few moments.');
            }
            
            const response = await fetchWithRetry(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            }, 3);

            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(0);

            console.log('📡 Response Status:', response.status, response.statusText);
            console.log('📡 Response Headers:');
            console.log('   Content-Type:', response.headers.get('content-type'));
            console.log('   CORS Origin:', response.headers.get('access-control-allow-origin'));
            console.log('⏱️  Request Duration:', duration, 'ms');
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ SERVER ERROR RESPONSE:');
                console.error('   Status:', response.status);
                console.error('   Text:', errorText);
                throw new Error(`Upload failed: ${response.status} ${response.statusText}\n${errorText}`);
            }

            const newFile = await response.json();
            console.log('✅ UPLOAD SUCCESS');
            console.log('   File ID:', newFile.id);
            console.log('   Blob URL:', newFile.blobUrl);
            console.log('   Duration:', duration, 'ms');
            console.log('═══════════════════════════════════════');
            
            onUpload(newFile);
            setFile(null);
            setNotes('');
            setError('');
            setUploadProgress(100);
            
            setTimeout(() => {
                setUploadProgress(0);
            }, 1500);
            
        } catch (err) {
            console.error('═══════════════════════════════════════');
            console.error('❌ UPLOAD ERROR DETAILS:');
            console.error('   Message:', err.message);
            console.error('   Stack:', err.stack);
            console.error('   API URL:', API_CONFIG.ENDPOINTS.UPLOAD);
            console.error('   Network Error?', err.message.includes('fetch'));
            console.error('═══════════════════════════════════════');
            
            // Provide helpful error messages
            let errorMessage = err.message || 'An error occurred during upload.';
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('TypeError')) {
                errorMessage = '❌ Failed to connect to backend.\n\nPossible reasons:\n1. Backend service is not running\n2. Network connectivity issue\n3. URL is incorrect\n\nPlease check the browser console for more details.';
            }
            
            setError(errorMessage);
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
