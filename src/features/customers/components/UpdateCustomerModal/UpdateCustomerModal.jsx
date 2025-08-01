// src/features/customers/components/UpdateCustomerModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './UpdateCustomerModal.module.scss';

const UpdateCustomerModal = ({ show, onHide, customer, onUpdate, loading = false }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        password: '' // Clear password field when customer data is loaded
      });
      setError('');
      setSuccess('');
    }
  }, [customer]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      setError('Họ tên không được để trống');
      return false;
    }

    if (!form.email.trim()) {
      setError('Email không được để trống');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Email không đúng định dạng');
      return false;
    }

    if (!form.phone.trim()) {
      setError('Số điện thoại không được để trống');
      return false;
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setError('Số điện thoại không đúng định dạng');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await onUpdate({ ...customer, id: customer._id, ...form });
      setSuccess('Cập nhật thông tin khách hàng thành công!');
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin khách hàng');
    }
  };

  const handleClose = () => {
    setForm({
      fullName: customer?.fullName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      password: ''
    });
    setError('');
    setSuccess('');
    onHide();
  };

  if (!customer) return null;

  return (
    <Modal show={show} onHide={handleClose} centered className={styles['update-customer-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUser className="me-2" />
          Cập nhật thông tin khách hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" />
              Họ và tên *
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập họ và tên khách hàng"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaEnvelope className="me-2" />
              Email *
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="example@email.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaPhone className="me-2" />
              Số điện thoại *
            </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="0123456789"
            />
            <Form.Text className="text-muted">
              Định dạng: 0123456789 hoặc +84123456789
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaMapMarkerAlt className="me-2" />
              Địa chỉ
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập địa chỉ khách hàng"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Để trống nếu không thay đổi mật khẩu"
            />
            <Form.Text className="text-muted">
              Chỉ điền nếu muốn thay đổi mật khẩu của khách hàng
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCustomerModal;
