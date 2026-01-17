/**
 * Frontend Configuration File
 * 
 * Environment-aware API URL configuration for React App
 * 
 * Configuration Priority:
 * 1. REACT_APP_API_BASE_URL environment variable (from .env files)
 * 2. Runtime hostname detection (localhost vs production)
 * 3. Default to production backend
 * 
 * Production Backend: https://file-manager-backend-app.azurewebsites.net
 * Development Backend: http://localhost:5000
 */

// ========================================
// API BASE URL CONFIGURATION
// ========================================

let API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('🔧 API Configuration Initialization');
console.log('   Environment Variable (REACT_APP_API_BASE_URL):', API_BASE_URL || 'not set');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   Hostname:', window.location.hostname);

// Fallback logic with detailed logging
if (!API_BASE_URL) {
  const hostname = window.location.hostname;
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  
  console.log('   Detecting environment: hostname-based fallback');
  
  if (isLocalDev) {
    API_BASE_URL = 'http://localhost:5000';
    console.warn('⚠️  Detected LOCAL development environment');
    console.warn('   Using LOCAL backend: http://localhost:5000');
  } else {
    // Production - use Azure backend
    API_BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
    console.log('✅ Detected PRODUCTION environment');
    console.log('   Using PRODUCTION Azure backend: https://file-manager-backend-app.azurewebsites.net');
  }
} else {
  const env = process.env.NODE_ENV || 'unknown';
  console.log(`✅ Using API URL from REACT_APP_API_BASE_URL (${env})`);
  console.log('   API_BASE_URL:', API_BASE_URL);
}

// Validate API URL format
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('❌ Invalid API URL format:', API_BASE_URL);
  API_BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
  console.warn('⚠️  Falling back to production backend');
}

// Remove trailing slash if present (normalize URLs)
API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

// Detailed configuration logging
console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('📋 API Configuration Summary');
console.log('═══════════════════════════════════════════════════');
console.log('   Protocol:', window.location.protocol);
console.log('   Hostname:', window.location.hostname);
console.log('   Base URL:', API_BASE_URL);
console.log('   Environment:', process.env.REACT_APP_ENVIRONMENT || 'auto-detected');
console.log('   Node Environment:', process.env.NODE_ENV);

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    UPLOAD: `${API_BASE_URL}/api/files`,
    LIST: `${API_BASE_URL}/api/files`,
    GET: (id) => `${API_BASE_URL}/api/files/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/files/${id}`,
    HEALTH: `${API_BASE_URL}/health`,
    API_INFO: `${API_BASE_URL}/`,
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  // Helper functions for common operations
  isProduction: () => !window.location.hostname.includes('localhost'),
  getBackendStatus: async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      return {
        status: response.status,
        ok: response.ok,
        url: API_CONFIG.ENDPOINTS.HEALTH,
      };
    } catch (err) {
      return {
        status: 0,
        ok: false,
        error: err.message,
        url: API_CONFIG.ENDPOINTS.HEALTH,
      };
    }
  },
};

// Validate endpoints
console.log('✅ API Endpoints configured:');
console.log('   UPLOAD:', API_CONFIG.ENDPOINTS.UPLOAD);
console.log('   LIST:', API_CONFIG.ENDPOINTS.LIST);
console.log('   GET(id):', API_CONFIG.ENDPOINTS.GET('example-id'));
console.log('   DELETE(id):', API_CONFIG.ENDPOINTS.DELETE('example-id'));
console.log('   HEALTH:', API_CONFIG.ENDPOINTS.HEALTH);

export default API_CONFIG;
