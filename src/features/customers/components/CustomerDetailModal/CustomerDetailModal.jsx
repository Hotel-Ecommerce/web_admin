// src/features/customers/components/CustomerDetailModal/CustomerDetailModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './CustomerDetailModal.module.scss';

const CustomerDetailModal = ({ show, onHide, customer }) => {
  if (!customer) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['customer-detail-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin khách hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Họ tên:</strong> {customer.fullName}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Số điện thoại:</strong> {customer.phone}</p>
        <p><strong>Địa chỉ:</strong> {customer.address || 'Chưa cập nhật'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;
