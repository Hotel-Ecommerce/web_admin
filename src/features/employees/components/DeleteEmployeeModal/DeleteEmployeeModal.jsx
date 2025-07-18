import React, { useState } from 'react';
import { deleteEmployee } from '../../EmployeeAPI';
import styles from './DeleteEmployeeModal.module.scss';

const DeleteEmployeeModal = ({ open, onClose, employee, token, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open || !employee) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteEmployee(employee._id, token);
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      setError('Xóa nhân viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Xác nhận xóa nhân viên</h3>
        <p>Bạn có chắc chắn muốn xóa nhân viên <b>{employee.fullName}</b> không?</p>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="button" onClick={onClose} disabled={loading}>Hủy</button>
          <button type="button" onClick={handleDelete} disabled={loading} className={styles.deleteBtn}>
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal; 