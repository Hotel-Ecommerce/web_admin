// src/features/customers/CustomerAPI.js
import axios from 'axios';

const API_URL = '/customers';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryCustomers = async (params = {}) => {
  const res = await axios.get(`${API_URL}/list`, {
    params,
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const updateCustomer = async (customer) => {
  const res = await axios.post(`${API_URL}/update`, customer, {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await axios.post(`${API_URL}/delete`, { id }, {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};
