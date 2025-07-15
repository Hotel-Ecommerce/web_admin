import axios from 'axios';

const API_URL = '/auth';

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const signup = async (signupData) => {
  // signupData: { name, email, password, ... }
  const res = await axios.post(`${API_URL}/signup`, signupData);
  return res.data;
};

export const signout = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/signout`, {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}; 