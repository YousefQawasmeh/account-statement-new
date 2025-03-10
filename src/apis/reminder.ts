import { Reminder } from '../types';
import { baseApiUrl } from '../utils';
import Axios from 'axios'

const API_URL = `${baseApiUrl}/reminders`;

export const getReminders = async (): Promise<Reminder[]> => {
  const response = await Axios.get(API_URL);
  return await response.data;
};

export const getReminder = async (id: string): Promise<Reminder> => {
  const response = await Axios.get(`${API_URL}/${id}`);
  return await response.data;
};

export const createReminder = async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  const response = await Axios.post(API_URL, reminder);
  return await response.data;
};

export const updateReminder = async (id: string, reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  const response = await Axios.put(`${API_URL}/${id}`, reminder);
  return await response.data;
};

export const deleteReminder = async (id: string): Promise<void> => {
  await Axios.delete(`${API_URL}/${id}`);
};
