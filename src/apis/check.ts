import apiClient from './apiClient';

const API_URL = '/checks';

export const getChecks = async () => {
    const res = await apiClient.get(`${API_URL}`);
    return res;
}

export const getAvailableChecks = async () => {
    const res = await apiClient.get(`${API_URL}?available=true`);
    return res;
}

export const createNewCheck = async (newCheck: any) => {
    const res = await apiClient.post(`${API_URL}`, newCheck);
    return res;
}

export const updateCheckById = async (id: string, newCheck: any) => {
    const res = await apiClient.put(`${API_URL}/${id}`, newCheck);
    return res;
}

export const deleteCheckById = async (id: string) => {
    const res = await apiClient.delete(`${API_URL}/${id}`);
    return res;
}

export default {
    getChecks,
    createNewCheck,
    updateCheckById,
    deleteCheckById
};
