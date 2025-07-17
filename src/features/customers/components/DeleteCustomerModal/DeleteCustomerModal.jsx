// src/features/customers/components/DeleteCustomerModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './DeleteCustomerModal.module.scss';

const DeleteCustomerModal = ({ show, onHide, customer, onDelete }) => {
  if (!customer) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-customer-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá khách hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá khách hàng <strong>{customer.fullName}</strong>?</p>
        <p>Email: {customer.email}</p>
        <p>Số điện thoại: {customer.phone}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Huỷ</Button>
        <Button variant="danger" onClick={() => onDelete(customer._id)}>Xoá</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCustomerModal;
