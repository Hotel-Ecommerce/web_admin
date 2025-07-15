import axios from 'axios';
const API_URL = '/statistics';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBookingStatistics = async (params = {}) =>
  axios.get(`${API_URL}/bookings`, { params, headers: { ...getAuthHeader() } }).then(res => res.data);
