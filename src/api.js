import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api';

const api = axios.create({
    baseURL
});

export const getTodayRates = () => api.get('/today');
export const getHistory = (days = 90) => api.get(`/history?days=${days}`);
export const fetchNow = () => api.get('/fetch-now');
export const getStatus = () => api.get('/status');

export const getMyGold = () => api.get('/mygold');
export const updateMyGold = (data) => api.post('/mygold', data);

export const getSoldHistory = () => api.get('/sold');
export const recordSale = (data) => api.post('/sold', data);
export const deleteSale = (id) => api.delete(`/sold/${id}`);

export default api;
