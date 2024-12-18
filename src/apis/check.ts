import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'



export const getChecks = async () => {
    const res = await Axios.get(`${API_URL}/checks`)
    return res
}

export const getAvailableChecks = async () => {
    const res = await Axios.get(`${API_URL}/checks?available=true`)
    return res
}

export const createNewCheck = async (newCheck: any) => {
    const res = await Axios.post(`${API_URL}/checks`, newCheck)
    return res
}

export const updateCheckById = async (id: string, newCheck: any) => {
    const res = await Axios.put(`${API_URL}/checks/${id}`, newCheck)
    return res
}

export const deleteCheckById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/checks/${id}`)
    return res
}


export default {
    getChecks,
    createNewCheck,
    updateCheckById,
    deleteCheckById
}