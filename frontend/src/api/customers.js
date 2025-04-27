import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const getCustomers = () => api.get('/customers');
export const createCustomer = data => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = id => api.delete(`/customers/${id}`);
export const uploadCSV = (formData, onUploadProgress) =>
  api.post('/customers/upload', formData, { onUploadProgress });