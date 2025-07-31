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
        <div><b>Mã:</b> {String(booking._id) || '-'}</div>
        <div><b>Khách hàng:</b> {booking.customerId && typeof booking.customerId === 'object' ? booking.customerId.fullName || '-' : String(booking.customerId) || '-'}</div>
        <div><b>Phòng:</b> {booking.roomId && typeof booking.roomId === 'object' ? booking.roomId.roomNumber || '-' : String(booking.roomId) || '-'}</div>
        <div><b>Ngày nhận:</b> {booking.checkInDate ? new Date(booking.checkInDate).toLocaleString() : '-'}</div>
        <div><b>Ngày trả:</b> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleString() : '-'}</div>
        <div><b>Trạng thái:</b> {typeof booking.status === 'object' ? '-' : String(booking.status) || '-'}</div>
        <div><b>Thanh toán:</b> {typeof booking.paymentStatus === 'object' ? '-' : String(booking.paymentStatus) || '-'}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal; 