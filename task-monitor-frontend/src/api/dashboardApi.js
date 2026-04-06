import api from './axiosConfig';

export const dashboardApi = {
  // User-specific dashboard: /api/user/dashboard
  getUserStats: () =>
    api.get('/api/user/dashboard'),

  // Admin-specific dashboard: /api/admin/dashboard
  getAdminStats: () =>
    api.get('/api/admin/dashboard'),

  // Admin: get all users list (dedicated endpoint)
  getUsers: () =>
    api.get('/api/admin/users'),

  // Admin: update a user
  updateUser: (id, data) =>
    api.put(`/api/admin/users/${id}`, data),

  // Admin: delete a user
  deleteUser: (id) =>
    api.delete(`/api/admin/users/${id}`),
};

export default dashboardApi;