import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { addCustomer } from '../../CustomerAPI';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';
import styles from './AddCustomerModal.module.scss';

const AddCustomerModal = ({ show, onHide, onAdd, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '123456' // Default password for new customers
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      password: '123456'
    });
    setError('');
    setSuccess('');
    onHide();
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Họ và tên không được để trống');
      return false;
    }

    if (formData.fullName.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email không được để trống');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Số điện thoại không được để trống');
      return false;
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không đúng định dạng. Ví dụ: 0123456789 hoặc +84123456789');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await onAdd(formData);
      setSuccess('Thêm khách hàng thành công!');
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi thêm khách hàng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered className={styles['add-customer-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUser className="me-2" />
          Thêm khách hàng mới
        </Modal.Title>
        <CloseModalButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" />
              Họ và tên *
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập họ và tên khách hàng"
              minLength={2}
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
              value={formData.email}
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
              value={formData.phone}
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
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập địa chỉ khách hàng"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock className="me-2" />
              Mật khẩu
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập mật khẩu cho khách hàng"
            />
            <Form.Text className="text-muted">
              Để trống để sử dụng mật khẩu mặc định: 123456
            </Form.Text>
          </Form.Group>

          <Alert variant="info">
            <strong>💡 Lưu ý:</strong> 
            <ul className="mb-0 mt-2">
              <li>Khách hàng mới sẽ có mật khẩu mặc định là "123456" nếu không nhập</li>
              <li>Email và số điện thoại phải là duy nhất trong hệ thống</li>
              <li>Khách hàng có thể đăng nhập ngay sau khi được tạo</li>
            </ul>
          </Alert>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang thêm...
                </>
              ) : (
                'Thêm khách hàng'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCustomerModal; 