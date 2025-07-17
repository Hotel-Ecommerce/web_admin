import axios from 'axios';
import {
  API_URL_STATISTICS,
  API_URL_STATISTICS_ADD,
  API_URL_STATISTICS_BOOKINGS
} from '../../core/constant/api_constant';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBookingStatistics = async (params = {}) =>
  axios.get(API_URL_STATISTICS_BOOKINGS, { params, headers: { ...getAuthHeader() } }).then(res => res.data);
