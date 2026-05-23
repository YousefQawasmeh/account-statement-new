import apiClient from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getChecks = async () => {
    const res = await apiClient.get(`${API_URL}/checks`);
    return res;
}

export const getAvailableChecks = async () => {
    const res = await apiClient.get(`${API_URL}/checks?available=true`);
    return res;
}

export const createNewCheck = async (newCheck: any) => {
    const res = await apiClient.post(`${API_URL}/checks`, newCheck);
    return res;
}

export const updateCheckById = async (id: string, newCheck: any) => {
    const res = await apiClient.put(`${API_URL}/checks/${id}`, newCheck);
    return res;
}

export const deleteCheckById = async (id: string) => {
    const res = await apiClient.delete(`${API_URL}/checks/${id}`);
    return res;
}

export default {
    getChecks,
    createNewCheck,
    updateCheckById,
    deleteCheckById
};
