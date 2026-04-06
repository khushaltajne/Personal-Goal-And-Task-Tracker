import axiosInstance from './axiosConfig';

export const noteApi = {
  createNote: async (content, taskId = null) => {
    return axiosInstance.post('/api/notes', { content, taskId });
  },
  getAllNotes: async () => {
    return axiosInstance.get('/api/notes');
  },
  getTaskNotes: async (taskId) => {
    return axiosInstance.get(`/api/notes/task/${taskId}`);
  },
  updateNote: async (id, data) => {
    return axiosInstance.put(`/api/notes/${id}`, data);
  },
  deleteNote: async (id) => {
    return axiosInstance.delete(`/api/notes/${id}`);
  }
};
