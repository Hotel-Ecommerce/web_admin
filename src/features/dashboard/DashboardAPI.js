import axios from 'axios';

export const getDashboardSummary = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('/dashboard/summary', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}; 