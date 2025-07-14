import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import styles from './AddBookingModal.module.scss';

const AddBookingModal = ({ show, onHide, onAdd }) => {
  const [form, setForm] = useState({
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setForm({
        customerId: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: ''
      });
      setError('');
    }
  }, [show]);

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
    if (!form.checkInDate) {
      setError('Vui lòng chọn ngày nhận phòng');
      return false;
    }
    if (!form.checkOutDate) {
      setError('Vui lòng chọn ngày trả phòng');
      return false;
    }
    if (new Date(form.checkInDate) >= new Date(form.checkOutDate)) {
      setError('Ngày trả phòng phải sau ngày nhận phòng');
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
      await onAdd(form);
      onHide();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi thêm đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className={styles['add-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm đặt phòng mới</Modal.Title>
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
              name="checkInDate"
              value={form.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày trả phòng *</Form.Label>
            <Form.Control
              type="date"
              name="checkOutDate"
              value={form.checkOutDate}
              onChange={handleChange}
              min={form.checkInDate || new Date().toISOString().split('T')[0]}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm đặt phòng'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddBookingModal; 