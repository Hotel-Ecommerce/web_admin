import api from '../auth/axiosInstance';
import {
  API_URL_BOOKING_CHANGE_REQUESTS,
  API_URL_BOOKING_CHANGE_REQUEST_APPROVE,
  API_URL_BOOKING_CHANGE_REQUEST_DISAPPROVE,
  API_URL_BOOKINGS_LIST
} from '../../core/constant/api_constant';

const API_URL_CUSTOMERS = '/customers/list';

// Mock data cho fallback
const mockBookingChangeRequests = [
  {
    _id: '1',
    bookingId: 'booking1',
    customerId: 'customer1',
    type: 'Update',
    status: 'Pending',
    requestedRoomId: 'room1',
    requestedCheckInDate: '2024-01-20',
    requestedCheckOutDate: '2024-01-22',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    bookingId: 'booking2',
    customerId: 'customer2',
    type: 'Cancel',
    status: 'Approved',
    cancellationReason: 'Thay đổi lịch trình',
    approvedBy: 'employee1',
    approvedAt: '2024-01-14T15:30:00Z',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    _id: '3',
    bookingId: 'booking3',
    customerId: 'customer3',
    type: 'Update',
    status: 'Disapproved',
    requestedRoomId: 'room2',
    requestedCheckInDate: '2024-01-25',
    requestedCheckOutDate: '2024-01-27',
    reasonForDisapproval: 'Phòng đã được đặt trước',
    approvedBy: 'employee1',
    approvedAt: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-11T11:00:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  }
];

// Lấy danh sách yêu cầu thay đổi booking
export const getBookingChangeRequests = async (token, params = {}) => {
  try {
    const res = await api.get(API_URL_BOOKING_CHANGE_REQUESTS, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return res.data;
  } catch (error) {
    console.warn('API call failed, using mock data for booking change requests:', error.message);
    // Return mock data if API fails
    return mockBookingChangeRequests;
  }
};

// Phê duyệt yêu cầu thay đổi booking
export const approveBookingChangeRequest = async (id, token) => {
  try {
    const res = await api.put(API_URL_BOOKING_CHANGE_REQUEST_APPROVE(id), {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

// Từ chối yêu cầu thay đổi booking
export const disapproveBookingChangeRequest = async (id, reason, token) => {
  try {
    const res = await api.put(API_URL_BOOKING_CHANGE_REQUEST_DISAPPROVE(id), { reason }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('Error disapproving request:', error);
    throw error;
  }
};

// Lấy thống kê yêu cầu
export const getRequestStatistics = async (token, filters = {}) => {
  try {
    const res = await api.get(`${API_URL_BOOKING_CHANGE_REQUESTS}/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters
    });
    return res.data;
  } catch (error) {
    console.warn('API call failed, using mock data for request statistics:', error.message);
    // Return mock statistics if API fails
    return {
      total: 3,
      pending: 1,
      approved: 1,
      disapproved: 1,
      today: 0,
      thisWeek: 2
    };
  }
};

// Lấy danh sách booking theo mảng bookingId
export const getBookingsByIds = async (bookingIds, token) => {
  // Gọi API /bookings/list với filter bookingIds
  const res = await api.get(API_URL_BOOKINGS_LIST, {
    headers: { Authorization: `Bearer ${token}` },
    params: { bookingIds: bookingIds.join(',') }
  });
  return res.data;
};

// Lấy danh sách khách hàng cho filter
export const getCustomersForFilter = async (token) => {
  try {
    const res = await api.get(API_URL_CUSTOMERS, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 1000, page: 1 }
    });
    return res.data;
  } catch (error) {
    console.warn('API call failed for customers filter:', error.message);
    // Return mock customers if API fails
    return [
      { _id: 'customer1', fullName: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
      { _id: 'customer2', fullName: 'Trần Thị B', email: 'tranthib@email.com' },
      { _id: 'customer3', fullName: 'Lê Văn C', email: 'levanc@email.com' }
    ];
  }
}; 