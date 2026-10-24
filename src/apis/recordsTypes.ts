import apiClient from './apiClient';
const API_URL = '/recordtypes';

export const createNewRecordType = async (newRecordType: any) => {
    const res = await apiClient.post(`${API_URL}`, newRecordType)
    return res
}

export const getRecordTypes = async () => {
    const res = await apiClient.get(`${API_URL}`)
    return res
}

export const getRecordTypeById = async (id: string) => {
    const res = await apiClient.get(`${API_URL}/${id}`)
    return res
}

export const deleteRecordTypeById = async (id: string) => {
    const res = await apiClient.delete(`${API_URL}/${id}`)
    return res
}

export const updateRecordTypeById = async (id: string, newRecordType: any) => {
    const res = await apiClient.put(`${API_URL}/${id}`, newRecordType)
    return res
}
