// src/features/customers/CustomerAPI.js
import axios from 'axios';
import {
  API_URL_CUSTOMERS,
  API_URL_CUSTOMERS_ADD,
  API_URL_CUSTOMERS_UPDATE,
  API_URL_CUSTOMERS_DELETE,
  API_URL_CUSTOMERS_GET,
  API_URL_CUSTOMERS_LIST,
  API_URL_CUSTOMER_BY_ID,
  API_URL_AUTH_SIGNUP
} from '../../core/constant/api_constant';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryCustomers = async (params = {}) => {
  const res = await axios.get(API_URL_CUSTOMERS_LIST, {
    params,
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await axios.get(API_URL_CUSTOMER_BY_ID(id), {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const updateCustomer = async (customer) => {
  const res = await axios.post(`${API_URL_CUSTOMERS_UPDATE}`, customer, {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await axios.post(`${API_URL_CUSTOMERS_DELETE}`, { id }, {
    headers: { ...getAuthHeader() }
  });
  return res.data;
};

export const signupCustomer = async (customerData) => {
  const res = await axios.post(API_URL_AUTH_SIGNUP, customerData);
  return res.data;
};
