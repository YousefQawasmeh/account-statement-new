import apiClient from './apiClient';
import { objectToFormData } from '../utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
type Ifilters = {
    date?: string;
    type?: number;
    userId?: string;
    cardId?: number;
    phone?: string;
    name?: string;
};

export const createNewRecord = async (newRecord: any) => {
    const res = await apiClient.post(`${API_URL}/records`, objectToFormData(newRecord), {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res;
};

export const getRecords = async (filters: Ifilters) => {
    const res = await apiClient.get(`${API_URL}/records`, { params: filters });
    return res;
};

export const getRecordById = async (id: string) => {
    const res = await apiClient.get(`${API_URL}/records/${id}`);
    return res;
};

export const deleteRecordById = async ({ id, notes }: { id: string; notes: string }) => {
    const res = await apiClient.delete(`${API_URL}/records/${id}`, { data: { notes } });
    return res;
};

export const updateRecordById = async (id: string, newRecord: any) => {
    const res = await apiClient.put(`${API_URL}/records/${id}`, newRecord);
    return res;
};

export default {
    createNewRecord,
    getRecords,
    getRecordById,
    deleteRecordById,
    updateRecordById
};
