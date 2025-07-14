import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import styles from './UpdateBookingModal.module.scss';

const UpdateBookingModal = ({ show, onHide, booking, onUpdate }) => {
  const [form, setForm] = useState({
    id: '',
    customerId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking && show) {
      setForm({
        id: booking.id || '',
        customerId: booking.customerId || '',
        roomId: booking.roomId || '',
        checkIn: booking.checkInDate || booking.checkIn || '',
        checkOut: booking.checkOutDate || booking.checkOut || '',
        totalPrice: booking.totalPrice || ''
      });
      setError('');
    }
  }, [booking, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.customerId.trim()) {
      setError('Vui lòng nhập ID khách hàng');
      return false;
    }
    if (!form.roomId.trim()) {
      setError('Vui lòng nhập ID phòng');
      return false;
    }
    if (!form.checkIn) {
      setError('Vui lòng chọn ngày nhận phòng');
      return false;
    }
    if (!form.checkOut) {
      setError('Vui lòng chọn ngày trả phòng');
      return false;
    }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      setError('Ngày trả phòng phải sau ngày nhận phòng');
      return false;
    }
    if (form.totalPrice && parseFloat(form.totalPrice) < 0) {
      setError('Tổng tiền không được âm');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await onUpdate(form);
      onHide();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} centered className={styles['update-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật đặt phòng</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>ID Khách hàng *</Form.Label>
            <Form.Control
              type="text"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              placeholder="Nhập ID khách hàng"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ID Phòng *</Form.Label>
            <Form.Control
              type="text"
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              placeholder="Nhập ID phòng"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày nhận phòng *</Form.Label>
            <Form.Control
              type="date"
              name="checkIn"
              value={form.checkIn}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày trả phòng *</Form.Label>
            <Form.Control
              type="date"
              name="checkOut"
              value={form.checkOut}
              onChange={handleChange}
              min={form.checkIn}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền (VNĐ)</Form.Label>
            <Form.Control
              type="number"
              name="totalPrice"
              value={form.totalPrice}
              onChange={handleChange}
              placeholder="Nhập tổng tiền"
              min="0"
              step="1000"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateBookingModal; 