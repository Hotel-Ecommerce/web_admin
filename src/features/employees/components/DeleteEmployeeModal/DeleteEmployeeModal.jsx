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
      console.error('Delete employee error:', err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        setError('❌ Không tìm thấy nhân viên này. Có thể đã bị xóa trước đó.');
      } else if (err.response?.status === 403) {
        setError('❌ Không có quyền xóa nhân viên này.');
      } else if (err.response?.status === 401) {
        setError('❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 409) {
        setError('❌ Không thể xóa nhân viên này vì đang có dữ liệu liên quan (booking, etc.).');
      } else if (err.response?.status === 500) {
        setError('❌ Lỗi server. Vui lòng thử lại sau.');
      } else {
        setError('❌ Có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>⚠️ Xác nhận xóa nhân viên</h3>
        <div className={styles.warningMessage}>
          <p><strong>Bạn có chắc chắn muốn xóa nhân viên này không?</strong></p>
          <div className={styles.employeeInfo}>
            <p><strong>Thông tin nhân viên:</strong></p>
            <ul>
              <li><strong>Họ tên:</strong> {employee.fullName}</li>
              <li><strong>Email:</strong> {employee.email}</li>
              <li><strong>Vai trò:</strong> {employee.role === 'Manager' ? 'Quản lý' : 'Admin'}</li>
              <li><strong>Số điện thoại:</strong> {employee.phone || 'Chưa cập nhật'}</li>
            </ul>
          </div>
          <div className={styles.warningNote}>
            <p><strong>⚠️ Lưu ý:</strong></p>
            <ul>
              <li>Hành động này không thể hoàn tác</li>
              <li>Tất cả dữ liệu liên quan đến nhân viên này sẽ bị xóa</li>
              <li>Nhân viên sẽ không thể đăng nhập vào hệ thống</li>
            </ul>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="button" onClick={onClose} disabled={loading} className={styles.cancelBtn}>
            Hủy
          </button>
          <button type="button" onClick={handleDelete} disabled={loading} className={styles.deleteBtn}>
            {loading ? '🔄 Đang xóa...' : '🗑️ Xóa nhân viên'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal; 