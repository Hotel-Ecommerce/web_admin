import api from './axiosInstance';

// Hàm đăng nhập
export const login = async (email, password) => {
  console.log('AuthAPI login called with:', { email });
  try {
    const res = await api.post('/auth/login', { email, password });
    console.log('AuthAPI login response:', res.data);
    return res.data; // { ...user, token }
  } catch (error) {
    console.error('AuthAPI login error:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm đăng xuất
export const signout = async () => {
  const token = localStorage.getItem('token');
  const res = await api.post('/auth/signout', {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
};

// Hàm đổi mật khẩu
export const changePassword = async (data, token) => {
  const res = await api.post('/auth/changePassword', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 