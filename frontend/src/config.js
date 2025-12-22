// Frontend Configuration File
// Environment-aware API URL configuration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

export default API_CONFIG;
