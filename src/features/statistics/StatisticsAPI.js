import axios from 'axios';
const API_URL = '/resource/statistics';

export const getBookingStatistics = async (params = {}) => axios.get(`${API_URL}/bookings`, { params }).then(res => res.data);
