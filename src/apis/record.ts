import Axios from 'axios'
const API_URL = 'https://super-market-eqe5.onrender.com'

export const createNewRecord = async (newRecord: any) => {
    const res = await Axios.post(`${API_URL}/api/records`, newRecord)
    return res
}

export const getRecords = async () => {
    const res = await Axios.get(`${API_URL}/api/records`)
    return res
}

export const getRecordById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/api/records/${id}`)
    return res
}

export const deleteRecordById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/api/records/${id}`)
    return res
}

export const updateRecordById = async (id: string, newRecord: any) => {
    const res = await Axios.put(`${API_URL}/api/records/${id}`, newRecord)
    return res
}

export default {
    createNewRecord,
    getRecords,
    getRecordById,
    deleteRecordById,
    updateRecordById
}