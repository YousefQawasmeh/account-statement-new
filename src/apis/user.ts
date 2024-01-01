import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = 'http://192.168.8.11:3000'
export const createNewUser = async (newUser: any) => {
    // console.log(newUser)
    // const newUser0 = {
    //     name: 'يوسف خالد دلال',
    //     phone: '0566252561',
    //     type: 1,
    //     password: '123456',
    //     cardId: 123
    // }
    // const res0 = await Axios.post(`${API_URL}/api/usertypes`, {id: 1, title: 'زبون'})
    // const res1 = await Axios.post(`${API_URL}/api/usertypes`, {id: 2, title: 'تاجر'})
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

export default {
    getUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserByCardId,
    deleteUserByCardId,
    updateUserByCardId
}