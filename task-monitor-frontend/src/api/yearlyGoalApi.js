import api from './axiosConfig';

export const yearlyGoalApi = {
  // Get yearly goals by year (backend requires year parameter)
  getAll: (year = new Date().getFullYear()) =>
    api.get('/api/yearly-goals', { params: { year } }),
  
  // Note: Backend doesn't provide getById
  getById: (id) => {
    console.warn('getById not implemented in backend');
    return Promise.reject(new Error('Not implemented'));
  },
  
  create: (data) =>
    api.post('/api/yearly-goals', data),
  
  // Note: Backend doesn't provide update
  update: (id, data) => {
    console.warn('update not implemented in backend');
    return Promise.reject(new Error('Not implemented'));
  },
  
  delete: (id) =>
    api.delete(`/api/yearly-goals/${id}`),
};

export const getYearlyGoals = () => yearlyGoalApi.getAll();
export const createYearlyGoal = (data) => yearlyGoalApi.create(data);
export const deleteYearlyGoal = (id) => yearlyGoalApi.delete(id);