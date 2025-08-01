// src/features/customers/components/DeleteCustomerModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle, FaUser, FaEnvelope, FaPhone, FaHistory } from 'react-icons/fa';
import styles from './DeleteCustomerModal.module.scss';

const DeleteCustomerModal = ({ show, onHide, customer, onDelete, loading = false }) => {
  const [error, setError] = useState('');

  if (!customer) return null;

  const formatPhone = (phone) => {
    if (!phone) return 'Chưa cập nhật';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('84')) {
      return `+84 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    } else if (cleaned.startsWith('0')) {
      return `+84 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const handleDelete = async () => {
    try {
      setError('');
      await onDelete(customer._id);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi xóa khách hàng');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-customer-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          Xác nhận xóa khách hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-3">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '2rem',
            color: 'white'
          }}>
            ⚠️
          </div>
        </div>

        <Alert variant="danger">
          <strong>⚠️ Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả thông tin và dữ liệu liên quan đến khách hàng sẽ bị xóa vĩnh viễn.
        </Alert>

        <div className="p-3 bg-light rounded">
          <h6 className="mb-3">Thông tin khách hàng sẽ bị xóa:</h6>
          
          <div className="d-flex align-items-center mb-2">
            <FaUser className="text-primary me-2" />
            <strong>Họ và tên:</strong> {customer.fullName}
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <FaEnvelope className="text-primary me-2" />
            <strong>Email:</strong> {customer.email}
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <FaPhone className="text-primary me-2" />
            <strong>Số điện thoại:</strong> {formatPhone(customer.phone)}
          </div>
          
          {customer.address && (
            <div className="mb-2">
              <strong>Địa chỉ:</strong> {customer.address}
            </div>
          )}
          
          {customer.bookingCount > 0 && (
            <div className="d-flex align-items-center mb-2">
              <FaHistory className="text-warning me-2" />
              <strong>Booking liên quan:</strong> {customer.bookingCount} booking
            </div>
          )}
          
          {customer.createdAt && (
            <div className="mb-2">
              <strong>Ngày tạo:</strong> {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>

        {customer.bookingCount > 0 && (
          <Alert variant="warning" className="mt-3">
            <strong>Lưu ý:</strong> Khách hàng này có {customer.bookingCount} booking. Việc xóa khách hàng có thể ảnh hưởng đến dữ liệu booking.
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang xóa...
            </>
          ) : (
            'Xóa khách hàng'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCustomerModal;
