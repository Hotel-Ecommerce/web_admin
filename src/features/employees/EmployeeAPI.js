import api from '../auth/axiosInstance';
import {
  API_URL_EMPLOYEES,
  API_URL_EMPLOYEES_LIST,
  API_URL_EMPLOYEES_ADD,
  API_URL_EMPLOYEES_UPDATE,
  API_URL_EMPLOYEES_DELETE,
  API_URL_EMPLOYEE_BY_ID,
  API_URL_EMPLOYEES_RESET_PASSWORD
} from '../../core/constant/api_constant';

// Lấy danh sách nhân viên
export const getEmployees = async (token) => {
  try {
    const res = await api.get('/employees/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('getEmployees error:', error.response?.data || error.message);
    throw error;
  }
};

// Thêm nhân viên mới
export const addEmployee = async (data, token) => {
  const res = await api.post(API_URL_EMPLOYEES_ADD, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Lấy thông tin nhân viên theo ID
export const getEmployeeById = async (id, token) => {
  const res = await api.get(API_URL_EMPLOYEE_BY_ID(id), {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (data, token) => {
  const res = await api.post(API_URL_EMPLOYEES_UPDATE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Xóa nhân viên
export const deleteEmployee = async (id, token) => {
  const res = await api.post(API_URL_EMPLOYEES_DELETE, { id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Reset mật khẩu nhân viên
export const resetEmployeePassword = async (id, newPassword, token) => {
  const res = await api.post(API_URL_EMPLOYEES_RESET_PASSWORD, { id, newPassword }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 