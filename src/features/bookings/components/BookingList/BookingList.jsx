import React, { useEffect, useState } from 'react';
import { getBookings } from '../../BookingAPI';
import { queryRooms } from '../../../rooms/RoomAPI';
import styles from './BookingList.module.scss';
import IconButton from '../../../../components/IconButton';
import { formatDate } from '../../../../utils/dateUtils';
import { FaEye, FaEdit, FaTrash, FaExchangeAlt, FaCheck, FaEllipsisH } from 'react-icons/fa';
import { Dropdown, Button, Pagination } from 'react-bootstrap';

const BookingList = ({ token, reload, filter, onEdit, onDelete, onDetail, onRequestChange, onMarkPaid }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
        const data = await queryRooms(token);
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch {}
    };
    if (token) {
      fetchBookings();
      fetchRooms();
    }
  }, [token, reload]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Hàm lọc booking theo filter
  const getFilteredBookings = () => {
    if (!filter) return bookings;
    return bookings.filter(booking => {
      // Lọc theo từ khóa search (mã, khách, phòng)
      if (filter.search) {
        const search = filter.search.toLowerCase();
        if (
          !booking._id.toLowerCase().includes(search) &&
          !(booking.customerId?.fullName || '').toLowerCase().includes(search) &&
          !(booking.roomId?.roomNumber || '').toLowerCase().includes(search)
        ) {
          return false;
        }
      }
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
        if (checkOut > to) return false;
      }
      // Lọc theo giá
      if (filter.minPrice && booking.totalPrice < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice && booking.totalPrice > filter.maxPrice) {
        return false;
      }
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Tạo các trang cho pagination
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả trang nếu ít hơn maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị trang thông minh
      if (currentPage <= 3) {
        // Trang đầu
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Trang cuối
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Trang giữa
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusBadge = (status) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Confirmed':
          return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
        case 'Cancelled':
          return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
        case 'Pending':
          return { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' };
        default:
          return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
      }
    };

    const statusLabels = {
      'Confirmed': 'Đã xác nhận',
      'Cancelled': 'Đã hủy',
      'Pending': 'Chờ xác nhận'
    };

    const style = getStatusColor(status);
    return (
      <span style={{
        ...style,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        minWidth: 'fit-content'
      }}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const getPaymentColor = (status) => {
      switch (status) {
        case 'Paid':
          return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
        case 'Unpaid':
          return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
        case 'Cancelled':
          return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
        default:
          return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
      }
    };

    const paymentLabels = {
      'Paid': 'Đã thanh toán',
      'Unpaid': 'Chưa thanh toán',
      'Cancelled': 'Đã hủy'
    };

    const style = getPaymentColor(paymentStatus);
    return (
      <span style={{
        ...style,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        minWidth: 'fit-content'
      }}>
        {paymentLabels[paymentStatus] || paymentStatus}
      </span>
    );
  };

  return (
    <div className={styles.bookingListContainer}>
      <div className={styles.tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>STT</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Mã booking</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Khách hàng</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Phòng</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Ngày nhận</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Ngày trả</th>
                             <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>Trạng thái</th>
               <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>Thanh toán</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, idx) => (
              <tr key={booking._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{indexOfFirstItem + idx + 1}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>
                  {String(booking._id).substring(0, 8) + '...'}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  {(() => {
                    if (booking.customerId && typeof booking.customerId === 'object') {
                      return booking.customerId.fullName || 'N/A';
                    } else if (booking.customerId) {
                      return String(booking.customerId);
                    } else {
                      return 'N/A';
                    }
                  })()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>
                  {(() => {
                    if (booking.room && typeof booking.room === 'object') {
                      return booking.room.roomNumber || 'N/A';
                    } else if (booking.roomId && typeof booking.roomId === 'object') {
                      return booking.roomId.roomNumber || 'N/A';
                    } else if (booking.room) {
                      return String(booking.room);
                    } else if (booking.roomId) {
                      return String(booking.roomId);
                    } else {
                      return 'N/A';
                    }
                  })()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{formatDate(booking.checkInDate)}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{formatDate(booking.checkOutDate)}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem', textAlign: 'center' }}>
                  {getStatusBadge(booking.status)}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', textAlign: 'center' }}>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="outline-secondary" 
                      size="sm"
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#6c757d',
                        padding: '4px 8px'
                      }}
                    >
                      <FaEllipsisH />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => onDetail && onDetail(booking)}>
                        <FaEye style={{ marginRight: '8px', color: '#1976d2' }} />
                        Xem chi tiết
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => onEdit && onEdit(booking)}>
                        <FaEdit style={{ marginRight: '8px', color: '#ff9800' }} />
                        Sửa
                      </Dropdown.Item>
                      {booking.paymentStatus === 'Unpaid' && (
                        <Dropdown.Item onClick={() => onMarkPaid && onMarkPaid(booking)}>
                          <FaCheck style={{ marginRight: '8px', color: '#4caf50' }} />
                          Đánh dấu đã thanh toán
                        </Dropdown.Item>
                      )}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => onDelete && onDelete(booking)} style={{ color: '#dc3545' }}>
                        <FaTrash style={{ marginRight: '8px' }} />
                        Xóa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '20px',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBookings.length)} trong tổng số {filteredBookings.length} booking
          </div>
          <Pagination style={{ margin: 0 }}>
            <Pagination.First 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {renderPageNumbers().map((page, index) => (
              <Pagination.Item
                key={index}
                active={page === currentPage}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                disabled={page === '...'}
                style={{ cursor: page === '...' ? 'default' : 'pointer' }}
              >
                {page}
              </Pagination.Item>
            ))}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BookingList; 