import api from './axiosConfig';

// Monthly Goal APIs
export const monthlyGoalApi = {
  // Get monthly goals by yearly goal (this is what backend provides)
  getByYearlyGoal: (yearlyGoalId) =>
    api.get(`/api/monthly-goals/yearly-goal/${yearlyGoalId}`),
  
  // Create monthly goal
  create: (goalData) =>
    api.post('/api/monthly-goals', goalData),
  
  // Note: Backend doesn't provide getAll, update, or delete for monthly goals
  // These would need to be added to the Spring Boot backend
  getAll: () => 
    api.get('/api/monthly-goals'),
  
  update: (id, goalData) => {
    console.warn('update not implemented in backend');
    return Promise.reject(new Error('Not implemented'));
  },
  
  delete: (id) =>
    api.delete(`/api/monthly-goals/${id}`),
};
