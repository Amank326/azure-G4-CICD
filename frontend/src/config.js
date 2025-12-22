// Frontend Configuration File
// Environment-aware API URL configuration

// Determine API base URL based on environment
let API_BASE_URL = process.env.REACT_APP_API_URL;

// Fallback logic
if (!API_BASE_URL) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_BASE_URL = 'http://localhost:5000';
  } else {
    // Production - derive from window location or use hardcoded
    API_BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
  }
}

// Remove trailing slash if present
API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

console.log('🔧 API Config - Base URL:', API_BASE_URL);
console.log('🔧 Environment - Hostname:', window.location.hostname);

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
};

console.log('✅ API Config Loaded:', API_CONFIG);

export default API_CONFIG;
