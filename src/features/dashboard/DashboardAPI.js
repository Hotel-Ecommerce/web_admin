import axios from 'axios';
import { API_URL_STATISTICS_BOOKINGS } from '../../core/constant/api_constant';

export const getDashboardSummary = async () => {
  const token = localStorage.getItem('token');
  // Lấy 7 ngày gần nhất
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  // Định dạng yyyy-mm-dd
  const toDateString = (d) => d.toISOString().slice(0, 10);
  const params = {
    startDate: toDateString(startDate),
    endDate: toDateString(endDate),
    groupBy: 'day'
  };
  const res = await axios.get(API_URL_STATISTICS_BOOKINGS, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    params
  });
  return res.data;
}; 