import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import styles from './AddCustomerModal.module.scss';

const AddCustomerModal = ({ show, onHide, onAdd, loading }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.fullName || !form.email || !form.phone) {
      setError('Vui lòng nhập đầy đủ họ tên, email và số điện thoại.');
      return;
    }
    try {
      await onAdd(form);
      setSuccess('Thêm khách hàng thành công!');
      setForm({ fullName: '', email: '', phone: '', address: '' });
      setTimeout(() => {
        setSuccess('');
        onHide();
      }, 1000);
    } catch (err) {
      setError('Có lỗi xảy ra khi thêm khách hàng.');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setForm({ fullName: '', email: '', phone: '', address: '' });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className={styles['add-customer-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm khách hàng mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>Huỷ</Button>{' '}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCustomerModal; 