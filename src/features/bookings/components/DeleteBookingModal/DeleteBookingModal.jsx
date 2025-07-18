import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { deleteBooking } from '../../BookingAPI';
import styles from './DeleteBookingModal.module.scss';

const DeleteBookingModal = ({ open, onClose, booking, token, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !booking) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteBooking(booking._id, token);
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      setError('Xóa booking thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa booking <b>{booking._id}</b> không?</p>
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Huỷ</Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBookingModal; 