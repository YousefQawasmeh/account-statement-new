import apiClient from './apiClient';

export const registerEmployee = async (data: any) => {
  return await apiClient.post('/auth/register', data);
};

export const loginEmployee = async (data: any) => {
  return await apiClient.post('/auth/login', data);
};

export const getEmployees = async () => {
  return await apiClient.get('/auth');
};

export const updateEmployee = async (id: string, data: any) => {
  return await apiClient.put(`/auth/${id}`, data);
};

export const deleteEmployee = async (id: string) => {
  return await apiClient.delete(`/auth/${id}`);
};

export default {
  registerEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
