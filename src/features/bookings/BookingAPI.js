// src/features/bookings/BookingAPI.js
import {
  API_URL_BOOKINGS,
  API_URL_BOOKINGS_ADD,
  API_URL_BOOKINGS_UPDATE,
  API_URL_BOOKINGS_DELETE,
  API_URL_BOOKINGS_GET,
  API_URL_BOOKINGS_LIST
} from '../../core/constant/api_constant';

class BookingAPI {
  // Get booking list with filters
  static async getBookingList(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort !== undefined) queryParams.append('sort', params.sort);
    if (params.customerId !== undefined) queryParams.append('customerId', params.customerId);
    if (params.roomId !== undefined) queryParams.append('roomId', params.roomId);
    if (params.checkInDate !== undefined) queryParams.append('checkInDate', params.checkInDate);
    if (params.checkOutDate !== undefined) queryParams.append('checkOutDate', params.checkOutDate);
    if (params.paymentStatus !== undefined) queryParams.append('paymentStatus', params.paymentStatus);

    const url = `${API_URL_BOOKINGS_LIST}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking list:', error);
      throw error;
    }
  }

  // Add new booking
  static async addBooking(bookingData) {
    try {
      const response = await fetch(API_URL_BOOKINGS_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerId: bookingData.customerId,
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  static async getBookingById(id) {
    try {
      const response = await fetch(API_URL_BOOKINGS_GET(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Update booking
  static async updateBooking(bookingData) {
    try {
      const response = await fetch(API_URL_BOOKINGS_UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: bookingData.id,
          customerId: bookingData.customerId,
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          totalPrice: bookingData.totalPrice
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Delete booking
  static async deleteBooking(id) {
    try {
      const response = await fetch(API_URL_BOOKINGS_DELETE(id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
}

export default BookingAPI;
