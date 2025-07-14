import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './DeleteEmployeeModal.module.scss';

const DeleteEmployeeModal = ({ show, onHide, employee, onDelete }) => {
  if (!employee) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-employee-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá nhân viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá nhân viên <strong>{employee.fullName}</strong>?</p>
        <p>Vai trò: {employee.role}</p>
        <p>Email: {employee.email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Huỷ</Button>
        <Button variant="danger" onClick={() => onDelete(employee.id)}>Xoá</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteEmployeeModal;
