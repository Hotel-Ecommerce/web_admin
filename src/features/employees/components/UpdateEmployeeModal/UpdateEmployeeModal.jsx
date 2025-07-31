import React, { useState, useEffect } from 'react';
import { updateEmployee, resetEmployeePassword } from '../../EmployeeAPI';
import styles from './UpdateEmployeeModal.module.scss';

const UpdateEmployeeModal = ({ open, onClose, employee, token, onUpdated }) => {
  const [form, setForm] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setSuccess(null);
    
    // Validation
    if (!form.fullName.trim()) {
      setError('❌ Vui lòng nhập họ tên nhân viên.');
      setLoading(false);
      return;
    }
    if (!form.email.trim()) {
      setError('❌ Vui lòng nhập email nhân viên.');
      setLoading(false);
      return;
    }
    if (!form.role) {
      setError('❌ Vui lòng chọn vai trò cho nhân viên.');
      setLoading(false);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('❌ Email không đúng định dạng. Vui lòng kiểm tra lại.');
      setLoading(false);
      return;
    }
    
    // Validate phone number (optional but if provided, must be valid)
    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone)) {
      setError('❌ Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng.');
      setLoading(false);
      return;
    }
    
    try {
      await updateEmployee(form, token);
      setSuccess(`✅ Cập nhật thông tin nhân viên thành công!

📋 Thông tin đã cập nhật:
• Họ tên: ${form.fullName}
• Email: ${form.email}
• Vai trò: ${form.role === 'Manager' ? 'Quản lý' : 'Admin'}
• Số điện thoại: ${form.phone || 'Chưa cập nhật'}

💡 Thay đổi sẽ có hiệu lực ngay lập tức.`);
      if (onUpdated) onUpdated();
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Update employee error:', err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        setError('❌ Không tìm thấy nhân viên này. Có thể đã bị xóa.');
      } else if (err.response?.status === 409) {
        setError('❌ Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
      } else if (err.response?.status === 400) {
        setError('❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else if (err.response?.status === 401) {
        setError('❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 403) {
        setError('❌ Không có quyền cập nhật nhân viên này.');
      } else if (err.response?.status === 500) {
        setError('❌ Lỗi server. Vui lòng thử lại sau.');
      } else {
        setError('❌ Có lỗi xảy ra khi cập nhật nhân viên. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password.trim()) {
      setError('❌ Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (password.length < 6) {
      setError('❌ Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetEmployeePassword(form.id, password, token);
      setSuccess(`✅ Reset mật khẩu thành công!

🔐 Mật khẩu mới đã được cập nhật cho nhân viên "${form.fullName}"

💡 Nhân viên có thể đăng nhập ngay với mật khẩu mới.`);
      setPassword('');
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        setError('❌ Không tìm thấy nhân viên này.');
      } else if (err.response?.status === 401) {
        setError('❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 403) {
        setError('❌ Không có quyền reset mật khẩu nhân viên này.');
      } else if (err.response?.status === 500) {
        setError('❌ Lỗi server. Vui lòng thử lại sau.');
      } else {
        setError('❌ Có lỗi xảy ra khi reset mật khẩu. Vui lòng thử lại.');
      }
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
          
          <div className={styles.passwordSection}>
            <h4>Reset Mật khẩu</h4>
            <label>
              Mật khẩu mới:
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </label>
            <button 
              type="button" 
              onClick={handleResetPassword} 
              disabled={loading || !password.trim()}
              className={styles.resetPasswordBtn}
            >
              {loading ? 'Đang reset...' : 'Reset Mật khẩu'}
            </button>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
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