import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './BookingDetailModal.module.scss';

const BookingDetailModal = ({ open, onClose, booking }) => {
  if (!open || !booking) return null;

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div><b>Mã:</b> {booking._id}</div>
        <div><b>Khách hàng:</b> {booking.customerId?.fullName || booking.customerId || '-'}</div>
        <div><b>Phòng:</b> {booking.roomId?.roomNumber || booking.roomId || '-'}</div>
        <div><b>Ngày nhận:</b> {booking.checkInDate ? new Date(booking.checkInDate).toLocaleString() : '-'}</div>
        <div><b>Ngày trả:</b> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleString() : '-'}</div>
        <div><b>Trạng thái:</b> {booking.status || '-'}</div>
        <div><b>Thanh toán:</b> {booking.paymentStatus || '-'}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal; 