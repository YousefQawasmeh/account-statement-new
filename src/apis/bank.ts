import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'



export const getBanks = async () => {
    const res = await Axios.get(`${API_URL}/banks`)
    return res
}

// export const getBankById = async (id: string) => {
//     const res = await Axios.get(`${API_URL}/banks/${id}`)
//     return res
// }

// export const createNewBank = async (newBank: any) => {
//     const res = await Axios.post(`${API_URL}/banks`, newBank)
//     return res
// }

// export const updateBankById = async (id: string, newBank: any) => {
//     const res = await Axios.put(`${API_URL}/banks/${id}`, newBank)
//     return res
// }

// export const deleteBankById = async (id: string) => {
//     const res = await Axios.delete(`${API_URL}/banks/${id}`)
//     return res
// }



export default {
    getBanks,
    // getBankById,
    // createNewBank,
    // updateBankById,
    // deleteBankById
}