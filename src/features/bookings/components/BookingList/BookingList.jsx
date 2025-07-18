import React, { useEffect, useState } from 'react';
import { getBookings } from '../../BookingAPI';
import { getRooms } from '../../../rooms/RoomAPI';
import styles from './BookingList.module.scss';
import IconButton from '../../../../components/IconButton';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const BookingList = ({ token, reload, filter, onEdit, onDelete, onDetail }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings(token);
        setBookings(data);
      } catch (err) {
        setError('Lỗi khi tải danh sách booking');
      } finally {
        setLoading(false);
      }
    };
    const fetchRooms = async () => {
      try {
        const data = await getRooms(token);
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch {}
    };
    if (token) {
      fetchBookings();
      fetchRooms();
    }
  }, [token, reload]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Hàm lọc booking theo filter
  const getFilteredBookings = () => {
    if (!filter) return bookings;
    return bookings.filter(booking => {
      // Lọc theo mã booking
      if (filter.bookingId && !booking._id.toLowerCase().includes(filter.bookingId.toLowerCase())) {
        return false;
      }
      // Lọc theo tên khách hàng
      if (filter.customerName) {
        const name = booking.customerId?.fullName || booking.customerId || '';
        if (!name.toLowerCase().includes(filter.customerName.toLowerCase())) {
          return false;
        }
      }
      // Lọc theo email khách hàng
      if (filter.customerEmail) {
        const email = booking.customerId?.email || '';
        if (!email.toLowerCase().includes(filter.customerEmail.toLowerCase())) {
          return false;
        }
      }
      // Lọc theo phòng
      if (filter.roomId && (booking.roomId?._id || booking.roomId) !== filter.roomId) {
        return false;
      }
      // Lọc theo loại phòng
      if (filter.roomType && booking.roomId?.type !== filter.roomType) {
        return false;
      }
      // Lọc theo trạng thái
      if (filter.status && booking.status !== filter.status) {
        return false;
      }
      // Lọc theo trạng thái thanh toán
      if (filter.paymentStatus && booking.paymentStatus !== filter.paymentStatus) {
        return false;
      }
      // Lọc theo ngày nhận
      if (filter.checkInFrom) {
        const checkIn = new Date(booking.checkInDate);
        const from = new Date(filter.checkInFrom);
        if (checkIn < from) return false;
      }
      if (filter.checkInTo) {
        const checkIn = new Date(booking.checkInDate);
        const to = new Date(filter.checkInTo);
        to.setHours(23,59,59,999);
        if (checkIn > to) return false;
      }
      // Lọc theo ngày trả
      if (filter.checkOutFrom) {
        const checkOut = new Date(booking.checkOutDate);
        const from = new Date(filter.checkOutFrom);
        if (checkOut < from) return false;
      }
      if (filter.checkOutTo) {
        const checkOut = new Date(booking.checkOutDate);
        const to = new Date(filter.checkOutTo);
        to.setHours(23,59,59,999);
        if (checkOut > to) return false;
      }
      // Lọc theo giá trị hóa đơn
      if (filter.totalFrom && (typeof booking.total !== 'undefined') && Number(booking.total) < Number(filter.totalFrom)) {
        return false;
      }
      if (filter.totalTo && (typeof booking.total !== 'undefined') && Number(booking.total) > Number(filter.totalTo)) {
        return false;
      }
      return true;
    });
  };
  const filteredBookings = getFilteredBookings();

  return (
    <div className={styles.bookingList}>
      <h2>Danh sách đặt phòng</h2>
      {/* Ẩn nút filter trong bảng, chỉ để trên header */}
      {/* <button onClick={handleOpenFilterModal} className={styles.filterBtn} title="Lọc booking" style={{background:'none',padding:0,border:'none'}}>Lọc</button> */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Khách hàng</th>
            <th>Phòng</th>
            <th>Ngày nhận</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.customerId?.fullName || booking.customerId || '-'}</td>
              <td>{booking.roomId?.roomNumber || booking.roomId || '-'}</td>
              <td>{booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '-'}</td>
              <td>{booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '-'}</td>
              <td>{booking.status || '-'}</td>
              <td style={{display:'flex',gap:8}}>
                <IconButton icon={FaEye} color="#1976d2" title="Xem chi tiết" onClick={() => onDetail && onDetail(booking)} />
                <IconButton icon={FaEdit} color="#ff9800" title="Sửa" onClick={() => onEdit && onEdit(booking)} />
                <IconButton icon={FaTrash} color="#d32f2f" title="Xóa" onClick={() => onDelete && onDelete(booking)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList; 