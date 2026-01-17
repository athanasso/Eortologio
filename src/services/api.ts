import axios from 'axios';

const API_BASE_URL = 'https://eortologio.iliasdev.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface NamedayEntry {
  day: number;
  month: number;
  celebrating_names: string[];
  saints: string[];
  other_info: string[];
  names_with_other_dates: string[];
}

export interface CelebrationDate {
  day: number;
  month: number;
  date_str: string;
  saint_description: string;
  saint_url?: string;
  related_names: string[];
}

export const getTodayNameDays = async (): Promise<NamedayEntry> => {
  const response = await api.get('/today');
  return response.data;
};

export const getMonthNameDays = async (month?: number): Promise<NamedayEntry[]> => {
    // If month is not provided, it fetches for current month (though API has /month endpoint for current)
    const url = month ? `/month/${month}` : '/month';
    const response = await api.get(url);
    return response.data;
};

export const searchNameDays = async (name: string): Promise<CelebrationDate[]> => {
  const response = await api.get(`/search/${encodeURIComponent(name)}`);
  return response.data;
};

export default api;
