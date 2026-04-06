import api from './axiosConfig';

export const authApi = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),
  
  logout: () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  },
  
  refreshToken: (refreshToken) =>
    api.post('/api/auth/refresh', { refreshToken }),
  
  getCurrentUser: () =>
    api.get('/api/auth/me'),
};

export const loginApi = (data) => authApi.login(data.email, data.password);
export const registerApi = (data) => authApi.register(data.username, data.email, data.password);
export const logoutApi = () => authApi.logout();
export const refreshTokenApi = (data) => authApi.refreshToken(data.refreshToken);