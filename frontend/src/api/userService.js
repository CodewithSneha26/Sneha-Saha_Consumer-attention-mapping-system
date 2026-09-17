import api from './axiosConfig';

export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response.data;
};