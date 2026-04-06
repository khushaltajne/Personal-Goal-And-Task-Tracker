import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Support both persistent (local) and isolated (session) storage
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    // Safety check against corrupted stringified nulls
    if (token === 'null' || token === 'undefined') {
        token = null;
    }

    // Don't send token for login/register endpoints to prevent 403s/401s on login routes
    const isAuthEndpoint = config.url && (config.url.includes('/api/auth/login') || config.url.includes('/api/auth/register'));
    
    if (token && !isAuthEndpoint) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session logout on 401 (Unauthorized) or 403 (Forbidden due to expired roles/tokens)
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      // Redirect to login with specific expired flag
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;