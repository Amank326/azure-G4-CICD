import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config';
import './BackendStatus.css';

const BackendStatus = () => {
    const [status, setStatus] = useState('checking');
    const [diagnostics, setDiagnostics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkBackendStatus = async () => {
            try {
                setStatus('checking');
                
                // First try health endpoint
                const healthUrl = API_CONFIG.ENDPOINTS.HEALTH;
                console.log('🔍 Checking backend health:', healthUrl);
                
                const healthResponse = await fetch(healthUrl, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000),
                });
                
                if (healthResponse.ok) {
                    const healthData = await healthResponse.json();
                    setStatus('healthy');
                    
                    // Try to get diagnostics
                    try {
                        const diagnosticsUrl = `${API_CONFIG.BASE_URL}/api/files/diagnostics`;
                        const diagResponse = await fetch(diagnosticsUrl, {
                            method: 'GET',
                            signal: AbortSignal.timeout(5000),
                        });
                        if (diagResponse.ok) {
                            const diagData = await diagResponse.json();
                            setDiagnostics(diagData);
                        }
                    } catch (diagErr) {
                        console.warn('Could not fetch diagnostics:', diagErr.message);
                    }
                } else {
                    setStatus('unhealthy');
                    setError(`Backend returned status ${healthResponse.status}`);
                }
            } catch (err) {
                console.error('❌ Backend health check failed:', err.message);
                setStatus('error');
                setError(err.message);
            }
        };

        checkBackendStatus();
        
        // Check every 30 seconds
        const interval = setInterval(checkBackendStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = () => {
        switch (status) {
            case 'checking': return '🔄';
            case 'healthy': return '✅';
            case 'unhealthy': return '⚠️';
            case 'error': return '❌';
            default: return '❓';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'healthy': return '#4CAF50';
            case 'unhealthy': return '#FFC107';
            case 'error': return '#F44336';
            default: return '#2196F3';
        }
    };

    return (
        <div className="backend-status" style={{ borderLeft: `4px solid ${getStatusColor()}` }}>
            <div className="status-header">
                <span className="status-icon">{getStatusIcon()}</span>
                <span className="status-text">
                    Backend Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </div>
            
            {error && (
                <div className="status-error">
                    Error: {error}
                </div>
            )}
            
            {diagnostics && (
                <div className="status-details">
                    <div className="detail-item">
                        <strong>Backend URL:</strong> {API_CONFIG.BASE_URL}
                    </div>
                    <div className="detail-item">
                        <strong>Azure Services:</strong>
                        <ul>
                            <li>Blob Storage: {diagnostics.azureServices?.blobStorage?.connected}</li>
                            <li>Cosmos DB: {diagnostics.azureServices?.cosmosDB?.connected}</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackendStatus;
