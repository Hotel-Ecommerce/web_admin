import React, { useState, useEffect } from 'react';
import { updateEmployee } from '../../EmployeeAPI';
import styles from './UpdateEmployeeModal.module.scss';

const UpdateEmployeeModal = ({ open, onClose, employee, token, onUpdated }) => {
  const [form, setForm] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      setForm({
        id: employee._id,
        fullName: employee.fullName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateEmployee(form, token);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError('Cập nhật nhân viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Cập nhật nhân viên</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Họ tên:
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input name="email" value={form.email} onChange={handleChange} required type="email" />
          </label>
          <label>
            Số điện thoại:
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Vai trò:
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">--Chọn vai trò--</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployeeModal; 