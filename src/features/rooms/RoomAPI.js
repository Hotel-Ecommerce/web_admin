import axios from 'axios';
const API_URL = '/rooms';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryRooms = async (params = {}) =>
  axios.get(`${API_URL}/list`, { params }).then(res => res.data);

export const getRoomById = async (id) =>
  axios.get(`${API_URL}/${id}`).then(res => res.data);

export const addRoom = async (formData) =>
  axios.post(`${API_URL}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeader()
    }
  }).then(res => res.data);

export const updateRoom = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader()
      }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRoom = async (id) =>
  axios.post(`${API_URL}/delete`, { id }, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  }).then(res => res.data);
