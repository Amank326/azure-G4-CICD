// Frontend Configuration File
// Environment-aware API URL configuration
// Production Backend: https://file-manager-backend-app.azurewebsites.net

let API_BASE_URL = process.env.REACT_APP_API_URL;

// Fallback logic with detailed logging
if (!API_BASE_URL) {
  const hostname = window.location.hostname;
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  
  if (isLocalDev) {
    API_BASE_URL = 'http://localhost:5000';
    console.warn('⚠️ Using LOCAL development backend');
  } else {
    // Production - use Azure backend
    API_BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
    console.log('✅ Using PRODUCTION Azure backend');
  }
} else {
  console.log('✅ Using API URL from REACT_APP_API_URL environment variable');
}

// Validate API URL format
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('❌ Invalid API URL format:', API_BASE_URL);
  API_BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
  console.warn('⚠️ Falling back to production backend');
}

// Remove trailing slash if present
API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

// Detailed configuration logging
console.log('🔧 API Configuration Summary:');
console.log('   Hostname:', window.location.hostname);
console.log('   Protocol:', window.location.protocol);
console.log('   Base URL:', API_BASE_URL);
console.log('   Environment:', process.env.NODE_ENV);

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    UPLOAD: `${API_BASE_URL}/api/files/upload`,
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
