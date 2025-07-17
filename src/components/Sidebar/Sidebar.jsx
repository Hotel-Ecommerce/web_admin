import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { UserContext } from '../../context/UserContext';

const menuConfig = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Manager', 'Admin', 'Customer'] },
  { path: '/customers', label: 'Khách hàng', icon: '👥', roles: ['Manager', 'Admin'] },
  { path: '/rooms', label: 'Phòng', icon: '🏨', roles: ['Manager', 'Admin'] },
  { path: '/bookings', label: 'Đặt phòng', icon: '📅', roles: ['Manager', 'Admin', 'Customer'] },
  { path: '/employees', label: 'Nhân viên', icon: '👨‍💼', roles: ['Manager'] },
  { path: '/statistics', label: 'Thống kê', icon: '📈', roles: ['Manager'] },
];

const Sidebar = () => {
  const location = useLocation();
  // const { user } = useContext(UserContext);
  // const userRole = user && user.role ? user.role.toLowerCase() : '';

  // Luôn hiển thị tất cả menu
  const filteredMenu = menuConfig;

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>HOTEL</div>
      <Nav className="flex-column">
        {filteredMenu.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={
              `${location.pathname === item.path ? styles.active : ''} d-flex align-items-center ${styles.menuItem}`
            }
            style={{ fontWeight: 500, fontSize: 18, marginBottom: 8, borderRadius: 8 }}
          >
            <span className="me-2" style={{ fontSize: 22 }}>{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </nav>
  );
};

export default Sidebar;
