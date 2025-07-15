import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/customers', label: 'Khách hàng', icon: '👥' },
    { path: '/rooms', label: 'Phòng', icon: '🏨' },
    { path: '/bookings', label: 'Đặt phòng', icon: '📅' },
    { path: '/employees', label: 'Nhân viên', icon: '👨‍💼' },
    { path: '/statistics', label: 'Thống kê', icon: '📈' },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>HOTEL</div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`${location.pathname === item.path ? styles.active : ''} d-flex align-items-center`}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </nav>
  );
};

export default Sidebar;
