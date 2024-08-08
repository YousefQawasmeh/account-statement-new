import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const createNewUser = async (newUser: any) => {
    const res = await Axios.post(`${API_URL}/users`, newUser)
    

    return res
}

export const getUsers = async () => {
    
    const res = await Axios.get(`${API_URL}/users`)
    return res
}

export const getUserById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/users/${id}`)
    return res
}

export const getUserByCardId = async (cardId: number) => {
    const res = await Axios.get(`${API_URL}/users/card/${cardId}`)
    // const res = await Axios.get(`${API_URL}/users?cardId=${cardId}`)
    return res
}

export const deleteUserById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/users/${id}`)
    return res
}

export const deleteUserByCardId = async (cardId: number) => {
    const res = await Axios.delete(`${API_URL}/users/card/${cardId}`)
    return res
}


export const updateUserById = async (id: string, newUser: any) => {
    const res = await Axios.put(`${API_URL}/users/${id}`, newUser)
    return res
}

export const updateUserByCardId = async (cardId: number, newUser: any) => {
    const res = await Axios.put(`${API_URL}/users/card/${cardId}`, newUser)
    return res
}

export const getNewCardId = async (cardType: number) => {
    const newCardId = await Axios.get(`${API_URL}/users/newCardId/${cardType}`)
    return newCardId
}

export default {
    getUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserByCardId,
    deleteUserByCardId,
    updateUserByCardId
}