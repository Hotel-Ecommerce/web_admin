import axios from 'axios';
import {
  API_URL_EMPLOYEES,
  API_URL_EMPLOYEES_ADD,
  API_URL_EMPLOYEES_UPDATE,
  API_URL_EMPLOYEES_DELETE,
  API_URL_EMPLOYEES_GET,
  API_URL_EMPLOYEES_LIST
} from '../../core/constant/api_constant';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryEmployees = async (params = {}) =>
  axios.get(API_URL_EMPLOYEES_LIST, { params, headers: { ...getAuthHeader() } }).then(res => res.data);

export const getEmployeeById = async (id) =>
  axios.get(`${API_URL_EMPLOYEES}/${id}`, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const addEmployee = async (data) =>
  axios.post(API_URL_EMPLOYEES_ADD, data, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const updateEmployee = async (data) =>
  axios.post(API_URL_EMPLOYEES_UPDATE, data, { headers: { ...getAuthHeader() } }).then(res => res.data);

export const deleteEmployee = async (id) =>
  axios.post(API_URL_EMPLOYEES_DELETE, { id }, { headers: { ...getAuthHeader() } }).then(res => res.data);
