import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { addEmployee } from '../../EmployeeAPI';

const AddEmployeeModal = ({ open, onClose, token, onAdded }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Manager',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation với thông báo chi tiết
    if (!form.fullName.trim()) {
      setError('❌ Vui lòng nhập họ tên nhân viên.');
      return;
    }
    if (!form.email.trim()) {
      setError('❌ Vui lòng nhập email nhân viên.');
      return;
    }
    if (!form.role) {
      setError('❌ Vui lòng chọn vai trò cho nhân viên.');
      return;
    }
    if (!form.password.trim()) {
      setError('❌ Vui lòng nhập mật khẩu cho nhân viên.');
      return;
    }
    if (form.password.length < 6) {
      setError('❌ Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('❌ Email không đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }
    
    // Validate phone number (optional but if provided, must be valid)
    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone)) {
      setError('❌ Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng.');
      return;
    }
    
    setLoading(true);
    try {
      await addEmployee(form, token);
      setSuccess(`✅ Thêm nhân viên "${form.fullName}" thành công! 
      
📋 Thông tin nhân viên mới:
• Họ tên: ${form.fullName}
• Email: ${form.email}
• Vai trò: ${form.role === 'Manager' ? 'Quản lý' : 'Admin'}
• Số điện thoại: ${form.phone || 'Chưa cập nhật'}

💡 Nhân viên có thể đăng nhập ngay với email và mật khẩu đã tạo.`);
      setForm({ fullName: '', email: '', phone: '', role: 'Manager', password: '' });
      if (onAdded) onAdded();
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Add employee error:', err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.status === 409) {
        setError('❌ Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
      } else if (err.response?.status === 400) {
        setError('❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else if (err.response?.status === 401) {
        setError('❌ Không có quyền thêm nhân viên. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 500) {
        setError('❌ Lỗi server. Vui lòng thử lại sau.');
      } else {
        setError('❌ Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setForm({ fullName: '', email: '', phone: '', role: 'Manager', password: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm nhân viên mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>Huỷ</Button>{' '}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployeeModal; 