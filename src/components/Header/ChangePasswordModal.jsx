import React, { useState } from 'react';
import { Button, Form, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { changePassword } from '../../features/auth/AuthAPI';
import CustomModal from './CustomModal';

const ChangePasswordModal = ({ show, onHide, token }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    
    if (oldPassword === newPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu cũ');
      return;
    }

    setLoading(true);
    try {
      await changePassword({ currentPassword: oldPassword, newPassword }, token);
      
      // Success notification - show both toast and alert
      setSuccess('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật.');
      setToastMessage('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật.');
      setToastType('success');
      setShowToast(true);
      
      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal after longer delay to ensure user sees the success message
      setTimeout(() => {
        setShowToast(false);
        setSuccess('');
        onHide();
      }, 3000);
      
    } catch (err) {
      let errorMessage = 'Đổi mật khẩu thất bại';
      
      // Handle specific error cases
      if (err?.response?.status === 401) {
        errorMessage = 'Mật khẩu cũ không chính xác';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // Error notification
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
      
      // Hide toast after 5 seconds for errors
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
      setShowToast(false);
      onHide();
    }
  };

  return (
    <>
      <CustomModal 
        show={show} 
        onHide={handleClose}
        title="Đổi mật khẩu"
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu cũ</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              disabled={loading}
              autoFocus
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                'Đổi mật khẩu'
              )}
            </Button>
          </div>
        </Form>
      </CustomModal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          delay={toastType === 'success' ? 3000 : 5000}
          autohide
          bg={toastType === 'success' ? 'success' : 'danger'}
        >
          <Toast.Header>
            {toastType === 'success' ? (
              <FaCheckCircle className="me-2 text-success" />
            ) : (
              <FaTimesCircle className="me-2 text-danger" />
            )}
            <strong className="me-auto">
              {toastType === 'success' ? 'Thành công' : 'Lỗi'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ChangePasswordModal; 