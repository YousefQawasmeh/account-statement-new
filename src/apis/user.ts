import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = 'https://super-market-eqe5.onrender.com'
export const createNewUser = async (newUser: any) => {
    const res = await Axios.post(`${API_URL}/api/users`, newUser)
    

    return res
}

export const getUsers = async () => {
    
    const res = await Axios.get(`${API_URL}/api/users`)
    return res
}

export const getUserById = async (id: string) => {
    const res = await Axios.get(`${API_URL}/api/users/${id}`)
    return res
}

export const getUserByCardId = async (cardId: number) => {
    const res = await Axios.get(`${API_URL}/api/users/card/${cardId}`)
    // const res = await Axios.get(`${API_URL}/api/users?cardId=${cardId}`)
    return res
}

export const deleteUserById = async (id: string) => {
    const res = await Axios.delete(`${API_URL}/api/users/${id}`)
    return res
}

export const deleteUserByCardId = async (cardId: number) => {
    const res = await Axios.delete(`${API_URL}/api/users/card/${cardId}`)
    return res
}


export const updateUserById = async (id: string, newUser: any) => {
    const res = await Axios.put(`${API_URL}/api/users/${id}`, newUser)
    return res
}

export const updateUserByCardId = async (cardId: number, newUser: any) => {
    const res = await Axios.put(`${API_URL}/api/users/card/${cardId}`, newUser)
    return res
}

export const getNewCardId = async (cardType: number) => {
    const newCardId = await Axios.get(`${API_URL}/api/users/newCardId/${cardType}`)
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