import axios from 'axios';
import {
  API_URL_EMPLOYEES,
  API_URL_EMPLOYEES_LIST,
  API_URL_EMPLOYEES_ADD,
  API_URL_EMPLOYEES_UPDATE,
  API_URL_EMPLOYEES_DELETE,
  API_URL_EMPLOYEE_BY_ID
} from '../../core/constant/api_constant';

// Lấy danh sách nhân viên
export const getEmployees = async (token) => {
  const res = await axios.get(API_URL_EMPLOYEES_LIST, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Thêm nhân viên mới
export const addEmployee = async (data, token) => {
  const res = await axios.post(API_URL_EMPLOYEES_ADD, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Lấy thông tin nhân viên theo ID
export const getEmployeeById = async (id, token) => {
  const res = await axios.get(API_URL_EMPLOYEE_BY_ID(id), {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (data, token) => {
  const res = await axios.post(API_URL_EMPLOYEES_UPDATE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Xóa nhân viên
export const deleteEmployee = async (id, token) => {
  const res = await axios.post(API_URL_EMPLOYEES_DELETE, { id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 