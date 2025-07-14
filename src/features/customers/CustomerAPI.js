// src/features/customers/CustomerAPI.js
import axios from 'axios';

const API_URL = '/customers';

export const queryCustomers = async (params = {}) => {
  const res = await axios.get(`${API_URL}/list`, { params });
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateCustomer = async (customer) => {
  const res = await axios.post(`${API_URL}/update`, customer);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await axios.post(`${API_URL}/delete`, { id });
  return res.data;
};
