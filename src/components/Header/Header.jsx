import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import styles from './Header.module.scss';
import { signout } from '../../features/auth/AuthAPI';
import { UserContext } from '../../context/UserContext';
import { getEmployeeById, updateEmployee } from '../../features/employees/EmployeeAPI';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, setUser } = useContext(UserContext);
  const token = user?.token;

  // Lấy thông tin employee khi mở modal
  useEffect(() => {
    const fetchEmployee = async () => {
      if (showModal && user?._id && token) {
        setLoading(true);
        setError('');
        try {
          const data = await getEmployeeById(user._id, token); // truyền token vào đây
          setEmployee(data);
        } catch (e) {
          setError('Không thể tải thông tin cá nhân');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEmployee();
  }, [showModal, user, token]);

  // Đăng xuất
  const handleLogout = async () => {
    setShowModal(false);
    try {
      await signout();
    } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <div
          className={styles.avatar}
          onClick={() => setShowModal(true)}
          tabIndex={0}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <span role="img" aria-label="user">👤</span>
        </div>
      </div>
      {/* Modal thông tin cá nhân */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin cá nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {/* Luôn hiển thị thông tin cá nhân, ưu tiên employee, fallback sang user context */}
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {(employee?.fullName || user?.fullName || user?.name || 'Không xác định')}
              </div>
              <div style={{ color: '#00AEEF', fontWeight: 500 }}>
                {(employee?.role || user?.role || 'Không xác định')}
              </div>
              <div style={{ marginTop: 8 }}><b>Email:</b> {(employee?.email || user?.email || 'Không xác định')}</div>
              <div><b>Số điện thoại:</b> {(employee?.phone || user?.phone || 'Không xác định')}</div>
              <Button
                variant="danger"
                style={{ marginTop: 18, marginLeft: 12, borderRadius: 6, fontWeight: 500 }}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;