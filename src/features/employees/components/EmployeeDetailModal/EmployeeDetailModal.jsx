import React from 'react';
import styles from './EmployeeDetailModal.module.scss';

const EmployeeDetailModal = ({ open, onClose, employee }) => {
  if (!open || !employee) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Chi tiết nhân viên</h3>
        <div className={styles.detailRow}><span>Họ tên:</span> <b>{employee.fullName}</b></div>
        <div className={styles.detailRow}><span>Email:</span> <b>{employee.email}</b></div>
        <div className={styles.detailRow}><span>Điện thoại:</span> <b>{employee.phone || '-'}</b></div>
        <div className={styles.detailRow}><span>Vai trò:</span> <b>{employee.role}</b></div>
        <div className={styles.detailRow}><span>Ngày tạo:</span> <b>{employee.createdAt ? new Date(employee.createdAt).toLocaleString() : '-'}</b></div>
        <div className={styles.detailRow}><span>Ngày cập nhật:</span> <b>{employee.updatedAt ? new Date(employee.updatedAt).toLocaleString() : '-'}</b></div>
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal; 