import Axios from 'axios'
// const API_URL = process.env.API_URL || `${API_URL}/api`
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
// const init = async () => {    
    // const res0 = await Axios.post(`${API_URL}/usertypes`, {id: 1, title: 'زبون'})
    // const res1 = await Axios.post(`${API_URL}/usertypes`, {id: 2, title: 'تاجر'})
    // const res00 = await Axios.post(`${API_URL}/recordtypes`, {id: 1, title: 'زبون'})
    // const res11 = await Axios.post(`${API_URL}/recordtypes`, {id: 2, title: 'دين'})
    // const res12 = await Axios.post(`${API_URL}/recordtypes`, {id: 3, title: 'تاجر'})
    // const res13 = await Axios.post(`${API_URL}/recordtypes`, {id: 4, title: 'تاجر'})
    // const res14 = await Axios.post(`${API_URL}/recordtypes`, {id: 5, title: 'تاجر'})
    // const res15 = await Axios.post(`${API_URL}/recordtypes`, {id: 6, title: 'تاجر'})
// }
// init()
    // const a = [
    //     {
    //         label: "نقدي",
    //         value: 0,
    //         color: "primary",
    //         variant: "contained",
    //         id: 4,
    //     },
    //     {
    //         label: "مشتريات",
    //         value: -1,
    //         color: "secondary",
    //         variant: "contained",
    //         id: 5,
    //     },
    //     {
    //         label: "صرف له",
    //         value: 1,
    //         color: "primary",
    //         variant: "outlined",
    //         id: 6,
    //     },
    //     {
    //         label: "نقدي",
    //         value: 0,
    //         color: "primary",
    //         variant: "contained",
    //         id: 1,
    //     },
    //     {
    //         label: "دين",
    //         value: 1,
    //         color: "secondary",
    //         variant: "contained",
    //         id: 2,
    //     },
    //     {
    //         label: "دفعة",
    //         value: -1,
    //         color: "primary",
    //         variant: "outlined",
    //         id: 3,
    //     },
    // ].forEach(recordType => {
    //     // if(recordType.id >= 3)
    //     Axios.post(`${API_URL}/recordtypes`, {
    //         id: recordType.id,
    //         title: recordType.label
    //     })
    // });
export const createNewUser = async (newUser: any) => {
    const res = await Axios.post(`${API_URL}/users`, newUser)
    

    return res
}

export const getUsers = async () => {
    
    const res = await Axios.get(`${API_URL}/users`)
    res.data.forEach((user: any) => {
        user.fullName = user.subName ? `${user.name} (${user.subName})` : user.name
    })
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