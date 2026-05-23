import { Reminder } from "../types";
import { baseApiUrl } from "../utils";
import apiClient from "./apiClient";

const API_URL = `${baseApiUrl}/reminders`;

export const getReminders = async (): Promise<Reminder[]> => {
  const response = await apiClient.get(API_URL);
  return await response.data;
};

export const getReminder = async (id: string): Promise<Reminder> => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return await response.data;
};

export const createReminder = async (reminder: Omit<Reminder, "id">): Promise<Reminder> => {
  const response = await apiClient.post(API_URL, reminder);
  return await response.data;
};

export const updateReminder = async (id: string, reminder: Omit<Reminder, "id">): Promise<Reminder> => {
  const response = await apiClient.put(`${API_URL}/${id}`, reminder);
  return await response.data;
};

export const deleteReminder = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_URL}/${id}`);
};

export const sendRemindersToOverdueUsersByIds = async (usersIds: number[]): Promise<any> => {
  const response = await apiClient.post(`${API_URL}/sendRemindersToOverdueUsersByIds`, { usersIds });
  return await response.data;
};
