import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './BookingDetailModal.module.scss';

const BookingDetailModal = ({ show, onHide, booking }) => {
  if (!booking) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['booking-detail-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin đặt phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Khách hàng:</strong> {booking.customerName}</p>
        <p><strong>Phòng:</strong> {booking.roomNumber}</p>
        <p><strong>Nhận phòng:</strong> {booking.checkInDate}</p>
        <p><strong>Trả phòng:</strong> {booking.checkOutDate}</p>
        <p><strong>Trạng thái thanh toán:</strong> {booking.paymentStatus}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal;
