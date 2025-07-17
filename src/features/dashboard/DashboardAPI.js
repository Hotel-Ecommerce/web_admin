import axios from 'axios';
import { API_URL_STATISTICS_BOOKINGS } from '../../core/constant/api_constant';

export const getDashboardSummary = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API_URL_STATISTICS_BOOKINGS, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}; 