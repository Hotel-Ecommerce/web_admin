import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './EmployeeDetailModal.module.scss';

const EmployeeDetailModal = ({ show, onHide, employee }) => {
  if (!employee) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['employee-detail-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin nhân viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Họ tên:</strong> {employee.fullName}</p>
        <p><strong>Vai trò:</strong> {employee.role}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Số điện thoại:</strong> {employee.phone}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeDetailModal;
