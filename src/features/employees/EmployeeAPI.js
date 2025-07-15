import axios from 'axios';
const API_URL = '/employees';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryEmployees = async (params = {}) =>
  axios.get(`${API_URL}/list`, { params, headers: { ...getAuthHeader() } }).then(res => res.data);

export const getEmployeeById = async (id) =>
  axios.get(`${API_URL}/${id}`, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const addEmployee = async (data) =>
  axios.post(`${API_URL}/add`, data, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const updateEmployee = async (data) =>
  axios.post(`${API_URL}/update`, data, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const deleteEmployee = async (id) =>
  axios.post(`${API_URL}/delete`, { id }, { headers: { ...getAuthHeader() } }).then(res => res.data);
