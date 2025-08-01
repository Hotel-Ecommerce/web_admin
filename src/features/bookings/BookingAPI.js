import api from '../auth/axiosInstance';
import {
  API_URL_BOOKINGS_LIST,
  API_URL_BOOKINGS_ADD,
  API_URL_BOOKINGS_UPDATE,
  API_URL_BOOKINGS_DELETE,
  API_URL_BOOKING_BY_ID,
  API_URL_BOOKING_MARK_PAID
} from '../../core/constant/api_constant';

// Lấy danh sách booking
export const getBookings = async (token) => {
  const res = await api.get(API_URL_BOOKINGS_LIST, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Thêm booking mới
export const addBooking = async (data, token) => {
  const res = await api.post(API_URL_BOOKINGS_ADD, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Lấy thông tin booking theo ID
export const getBookingById = async (id, token) => {
  const res = await api.get(API_URL_BOOKING_BY_ID(id), {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Cập nhật thông tin booking
export const updateBooking = async (data, token) => {
  const res = await api.post(API_URL_BOOKINGS_UPDATE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Xóa booking
export const deleteBooking = async (id, token) => {
  const res = await api.post(API_URL_BOOKINGS_DELETE, { id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Đánh dấu booking đã thanh toán
export const markBookingPaid = async (id, token) => {
  const res = await api.put(API_URL_BOOKING_MARK_PAID(id), {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 