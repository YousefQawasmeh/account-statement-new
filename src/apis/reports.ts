import { baseApiUrl } from "../utils";
import apiClient from "./apiClient";

const API_URL = `${baseApiUrl}/reports`;

export const getUsersWithMismatchedTotal = async (): Promise<any[]> => {
  const response = await apiClient.get(`${API_URL}/usersWithMismatchedTotal`);
  return await response.data;
};

export const getOverdueUsers = async (days: number): Promise<any> => {
  const response = await apiClient.get(`${API_URL}/overdueUsers/${days}`);
  return await response.data;
};
