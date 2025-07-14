import axios from 'axios';
const API_URL = '/resource/employees';

export const queryEmployees = async (params = {}) => axios.get(`${API_URL}/list`, { params }).then(res => res.data);
export const getEmployeeById = async (id) => axios.get(`${API_URL}/${id}`).then(res => res.data);
export const addEmployee = async (data) => axios.post(`${API_URL}/add`, data).then(res => res.data);
export const updateEmployee = async (data) => axios.post(`${API_URL}/update`, data).then(res => res.data);
export const deleteEmployee = async (id) => axios.post(`${API_URL}/delete`, { id }).then(res => res.data);
