import React, { useState, useEffect } from 'react';
import { requestBookingChange, requestBookingCancellation } from '../../BookingAPI';
import { useUser } from '../../../context/UserContext';
import styles from './RequestBookingChangeModal.module.scss';

const RequestBookingChangeModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const { user } = useUser();
  const [requestType, setRequestType] = useState('Update'); // 'Update' or 'Cancel'
  const [formData, setFormData] = useState({
    requestedRoomId: '',
    requestedCheckInDate: '',
    requestedCheckOutDate: '',
    cancellationReason: ''
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && booking) {
      console.log('Booking data in modal:', booking);
      console.log('roomId:', booking.roomId);
      console.log('customerId:', booking.customerId);
      // Reset form when modal opens
      setFormData({
        requestedRoomId: booking.roomId?._id || '',
        requestedCheckInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
        requestedCheckOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split('T')[0] : '',
        cancellationReason: ''
      });
      setErrors({});
      fetchRooms();
    }
  }, [isOpen, booking]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:7079/rooms/list');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (requestType === 'Update') {
      if (!formData.requestedRoomId) {
        newErrors.requestedRoomId = 'Vui lòng chọn phòng';
      }
      if (!formData.requestedCheckInDate) {
        newErrors.requestedCheckInDate = 'Vui lòng chọn ngày check-in';
      }
      if (!formData.requestedCheckOutDate) {
        newErrors.requestedCheckOutDate = 'Vui lòng chọn ngày check-out';
      }
      if (formData.requestedCheckInDate && formData.requestedCheckOutDate) {
        const checkIn = new Date(formData.requestedCheckInDate);
        const checkOut = new Date(formData.requestedCheckOutDate);
        if (checkIn >= checkOut) {
          newErrors.requestedCheckOutDate = 'Ngày check-out phải sau ngày check-in';
        }
        if (checkIn < new Date()) {
          newErrors.requestedCheckInDate = 'Ngày check-in không thể ở quá khứ';
        }
      }
    } else if (requestType === 'Cancel') {
      if (!formData.cancellationReason.trim()) {
        newErrors.cancellationReason = 'Vui lòng nhập lý do hủy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (requestType === 'Update') {
        await requestBookingChange({
          bookingId: booking._id,
          requestedRoomId: formData.requestedRoomId,
          requestedCheckInDate: formData.requestedCheckInDate,
          requestedCheckOutDate: formData.requestedCheckOutDate
        }, user.token);
      } else {
        await requestBookingCancellation({
          bookingId: booking._id,
          cancellationReason: formData.cancellationReason
        }, user.token);
      }

      alert(`Yêu cầu ${requestType === 'Update' ? 'thay đổi' : 'hủy'} đã được gửi thành công!`);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Yêu cầu thay đổi booking</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Booking Info */}
          <div className={styles.bookingInfo}>
            <h3>Thông tin booking hiện tại:</h3>
            <p><strong>Phòng:</strong> {booking.roomId?.roomNumber} ({booking.roomId?.type})</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái:</strong> {booking.status}</p>
            <p><strong>Thanh toán:</strong> {booking.paymentStatus}</p>
          </div>

          {/* Request Type Selection */}
          <div className={styles.requestTypeSection}>
            <h3>Loại yêu cầu:</h3>
            <div className={styles.requestTypeButtons}>
              <button
                type="button"
                className={`${styles.typeButton} ${requestType === 'Update' ? styles.active : ''}`}
                onClick={() => setRequestType('Update')}
              >
                Thay đổi thông tin
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${requestType === 'Cancel' ? styles.active : ''}`}
                onClick={() => setRequestType('Cancel')}
              >
                Hủy booking
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {requestType === 'Update' && (
              <>
                <div className={styles.formGroup}>
                  <label>Phòng mới:</label>
                  <select
                    value={formData.requestedRoomId}
                    onChange={(e) => handleInputChange('requestedRoomId', e.target.value)}
                    className={errors.requestedRoomId ? styles.error : ''}
                  >
                    <option value="">Chọn phòng</option>
                    {rooms.map(room => (
                      <option key={room._id} value={room._id}>
                        {room.roomNumber} - {room.type} - {room.price.toLocaleString()}đ/đêm
                      </option>
                    ))}
                  </select>
                  {errors.requestedRoomId && <span className={styles.errorText}>{errors.requestedRoomId}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Ngày check-in mới:</label>
                  <input
                    type="date"
                    value={formData.requestedCheckInDate}
                    onChange={(e) => handleInputChange('requestedCheckInDate', e.target.value)}
                    className={errors.requestedCheckInDate ? styles.error : ''}
                  />
                  {errors.requestedCheckInDate && <span className={styles.errorText}>{errors.requestedCheckInDate}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Ngày check-out mới:</label>
                  <input
                    type="date"
                    value={formData.requestedCheckOutDate}
                    onChange={(e) => handleInputChange('requestedCheckOutDate', e.target.value)}
                    className={errors.requestedCheckOutDate ? styles.error : ''}
                  />
                  {errors.requestedCheckOutDate && <span className={styles.errorText}>{errors.requestedCheckOutDate}</span>}
                </div>
              </>
            )}

            {requestType === 'Cancel' && (
              <div className={styles.formGroup}>
                <label>Lý do hủy:</label>
                <textarea
                  value={formData.cancellationReason}
                  onChange={(e) => handleInputChange('cancellationReason', e.target.value)}
                  placeholder="Nhập lý do hủy booking..."
                  rows="4"
                  className={errors.cancellationReason ? styles.error : ''}
                />
                {errors.cancellationReason && <span className={styles.errorText}>{errors.cancellationReason}</span>}
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : `Gửi yêu cầu ${requestType === 'Update' ? 'thay đổi' : 'hủy'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestBookingChangeModal; 