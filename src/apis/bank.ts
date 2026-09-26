import apiClient from './apiClient';

const API_URL = '/banks';

export const getBanks = async () => {
    const res = await apiClient.get(`${API_URL}`);
    return res;
}

// export const getBankById = async (id: string) => {
//     const res = await apiClient.get(`${API_URL}/${id}`);
//     return res;
// }

// export const createNewBank = async (newBank: any) => {
//     const res = await apiClient.post(`${API_URL}`, newBank);
//     return res;
// }

// export const updateBankById = async (id: string, newBank: any) => {
//     const res = await apiClient.put(`${API_URL}/${id}`, newBank);
//     return res;
// }

// export const deleteBankById = async (id: string) => {
//     const res = await apiClient.delete(`${API_URL}/${id}`);
//     return res;
// }

export default {
    getBanks,
    // getBankById,
    // createNewBank,
    // updateBankById,
    // deleteBankById
};
