import api from './axiosConfig';

// Task APIs
export const taskApi = {
  // Get all tasks (Spring Boot returns paginated results)
  getAll: (params = {}) =>
    api.get('/api/tasks', { params }),
  
  // Get single task
  getById: (id) =>
    api.get(`/api/tasks/${id}`),
  
  // Create task
  create: (taskData) =>
    api.post('/api/tasks', taskData),
  
  // Update task (Note: Spring Boot may not have general update, only start/complete)
  update: (id, taskData) =>
    api.put(`/api/tasks/${id}`, taskData),
  
  // Start task
  start: (id) =>
    api.put(`/api/tasks/${id}/start`),
  
  // Complete task
  complete: (id) =>
    api.put(`/api/tasks/${id}/complete`),
  
  // Delete task
  delete: (id) =>
    api.delete(`/api/tasks/${id}`),
  
  // Get tasks by status (use query params)
  getByStatus: (status) =>
    api.get('/api/tasks', { params: { status } }),
};
