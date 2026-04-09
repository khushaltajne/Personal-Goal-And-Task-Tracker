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
  async (error) => {
    const originalRequest = error.config;

    // Trigger refresh logic on 401 or 403, ensuring we don't infinitely loop on retry
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Use native axios to avoid interceptor loops if refresh itself fails
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
          
          if (response.data && response.data.accessToken) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Update storage based on where it was originally stored
            if (localStorage.getItem('token')) {
              localStorage.setItem('token', accessToken);
              if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            } else {
              sessionStorage.setItem('token', accessToken);
              if (newRefreshToken) sessionStorage.setItem('refreshToken', newRefreshToken);
            }

            // Update original request headers with new valid token
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            // Retry the original request
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh token validation failed:", refreshError);
        }
      }

      // If we reach here, refresh failed or no refresh token was found.
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login?expired=true';
    }

    return Promise.reject(error);
  }
);

export default api;