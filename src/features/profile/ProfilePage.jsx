import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const user = JSON.parse(localStorage.getItem('user')) || { email: 'user@gmail.com', role: 'Manager', name: 'User' };

const ProfilePage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <Card style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(30,42,56,0.08)' }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 48, background: '#e0f7fa', color: '#00AEEF', borderRadius: '50%', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            <div>
              <h4 style={{ margin: 0, color: '#1C1C1E', fontWeight: 700 }}>{user.name || 'User'}</h4>
              <div style={{ color: '#6C757D', fontSize: 16 }}>{user.role || 'Manager'}</div>
            </div>
          </div>
          <div style={{ color: '#1C1C1E', fontSize: 16, marginBottom: 12 }}><b>Email:</b> {user.email}</div>
          <Button style={{ background: '#00AEEF', border: 'none', borderRadius: 6, fontWeight: 500 }} onClick={() => navigate('/change-password')}>
            Đổi mật khẩu
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage; 