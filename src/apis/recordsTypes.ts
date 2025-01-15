import Axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const createNewRecordType = async (newRecordType: any) => {
    const res = await Axios.post(`${API_URL}/recordtypes`, newRecordType)
    return res
}

export const getRecordTypes = async () => {
    const res = await Axios.get(`${API_URL}/recordtypes`)
    return res
}

export const getRecordTypeById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/recordtypes/${id}`)
    return res
}

export const deleteRecordTypeById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/recordtypes/${id}`)
    return res
}

export const updateRecordTypeById = async (id: string, newRecordType: any) => {
    const res = await Axios.put(`${API_URL}/recordtypes/${id}`, newRecordType)
    return res
}