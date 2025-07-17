import axios from 'axios';
import {
  API_URL_ROOMS,
  API_URL_ROOMS_ADD,
  API_URL_ROOMS_UPDATE,
  API_URL_ROOMS_DELETE,
  API_URL_ROOMS_GET,
  API_URL_ROOMS_LIST,
  API_URL_ROOM_BY_ID
} from '../../core/constant/api_constant';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const queryRooms = async (params = {}) =>
  axios.get(API_URL_ROOMS_LIST, { params }).then(res => res.data);

export const getRoomById = async (id) =>
  axios.get(API_URL_ROOM_BY_ID(id)).then(res => res.data);

export const addRoom = async (formData) =>
  axios.post(API_URL_ROOMS_ADD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeader()
    }
  }).then(res => res.data);

export const updateRoom = async (formData) => {
  try {
    const res = await axios.post(API_URL_ROOMS_UPDATE, formData, {
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
  axios.post(API_URL_ROOMS_DELETE, { id }, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  }).then(res => res.data);
