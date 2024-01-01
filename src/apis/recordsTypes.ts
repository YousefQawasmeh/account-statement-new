import Axios from 'axios'
const API_URL = 'http://192.168.8.11:3000'

export const createNewRecordType = async (newRecordType: any) => {
    const res = await Axios.post(`${API_URL}/api/recordtypes`, newRecordType)
    return res
}

export const getRecordTypes = async () => {
    const res = await Axios.get(`${API_URL}/api/recordtypes`)
    return res
}

export const getRecordTypeById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/api/recordtypes/${id}`)
    return res
}

export const deleteRecordTypeById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/api/recordtypes/${id}`)
    return res
}

export const updateRecordTypeById = async (id: string, newRecordType: any) => {
    const res = await Axios.put(`${API_URL}/api/recordtypes/${id}`, newRecordType)
    return res
}