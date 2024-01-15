import Axios from 'axios'
type Ifilters = {
    date?: string
    type?: number
    userId?: string
    cardId?: number
    phone?: string
    name?: string
}

export const createNewRecord = async (newRecord: any) => {
    const res = await Axios.post(`${API_URL}/api/records`, newRecord)
    return res
}

export const getRecords = async (filters: Ifilters) => {
    const res = await Axios.get(`${API_URL}/api/records`, {params: filters})
    return res
}

export const getRecordById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/api/records/${id}`)
    return res
}

export const deleteRecordById = async ({id, notes}:{id: string, notes: string}) => {
    const res = await Axios.delete(`${API_URL}/api/records/${id}`, {data: {notes}})
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