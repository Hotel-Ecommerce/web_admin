import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './DeleteBookingModal.module.scss';

const DeleteBookingModal = ({ show, onHide, booking, onDelete }) => {
  if (!booking) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá đặt phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá đặt phòng của <strong>{booking.customerName}</strong>?</p>
        <p>Phòng: {booking.roomNumber}</p>
        <p>Nhận phòng: {booking.checkInDate}</p>
        <p>Trả phòng: {booking.checkOutDate}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Huỷ</Button>
        <Button variant="danger" onClick={() => onDelete(booking.id)}>Xoá</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBookingModal;
