import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp.');
      return;
    }
    // Giả lập thành công
    setTimeout(() => {
      setSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/profile'), 1200);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <Card style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(30,42,56,0.08)' }}>
        <Card.Body>
          <h4 style={{ color: '#1C1C1E', fontWeight: 700, marginBottom: 24 }}>Đổi mật khẩu</h4>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={() => navigate('/profile')}>Huỷ</Button>
              <Button style={{ background: '#00AEEF', border: 'none', borderRadius: 6, fontWeight: 500 }} type="submit">Lưu</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePasswordPage; 