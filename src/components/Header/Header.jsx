import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import styles from './Header.module.scss';
import { signout } from '../../features/auth/AuthAPI';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const avatarRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    setOpen(false);
    navigate('/profile');
  };
  const handleChangePassword = () => {
    setOpen(false);
    navigate('/change-password');
  };
  const handleLogout = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };
  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await signout();
    } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* Có thể giữ logo nhỏ hoặc bỏ hoàn toàn nếu không cần */}
        {/* <span className={styles.logo}>HOTEL</span> */}
      </div>
      <div className={styles.right}>
        <div
          className={styles.avatar}
          ref={avatarRef}
          onClick={() => setOpen((v) => !v)}
          tabIndex={0}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <span role="img" aria-label="user">👤</span>
          {open && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem} onClick={handleProfile}>Thông tin cá nhân</div>
              <div className={styles.dropdownItem} onClick={handleChangePassword}>Đổi mật khẩu</div>
              <div className={styles.dropdownItem} style={{ color: '#dc3545' }} onClick={handleLogout}>Đăng xuất</div>
            </div>
          )}
        </div>
      </div>
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đăng xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn đăng xuất không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;