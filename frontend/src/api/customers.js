import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers`);
  return response.data;
};

export const addCustomer = async (customerData) => {
  const response = await axios.post(`${API_URL}/customers`, customerData);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await axios.delete(`${API_URL}/customers/${id}`);
};

export const uploadCSV = async (formData, onProgress) => {
  await axios.post(`${API_URL}/customers/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });
};
