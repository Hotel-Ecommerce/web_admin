import React from 'react';
import { formatDate } from '../../../utils/dateUtils';

const RequestDetailInfo = ({ request, booking, room, customer }) => {
  return (
    <div>
      <h4>Thông tin khách hàng</h4>
      <div>Tên: {customer?.fullName || '-'}</div>
      <div>Email: {customer?.email || '-'}</div>
      <div>SĐT: {customer?.phone || '-'}</div>
      <h4>Thông tin booking</h4>
      <div>Mã booking: {booking?._id || '-'}</div>
      <div>Phòng: {room?.roomNumber || '-'}</div>
      <div>Check-in: {formatDate(booking?.checkInDate)}</div>
      <div>Check-out: {formatDate(booking?.checkOutDate)}</div>
    </div>
  );
};

export default RequestDetailInfo; 