import React, { useContext, useRef, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './Sidebar.module.scss';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlinePeopleAlt, MdOutlineMeetingRoom, MdOutlineEventAvailable, MdOutlineAssignment, MdOutlinePersonOutline, MdOutlineBarChart } from 'react-icons/md';

const menuConfig = [ 
  { path: '/dashboard', label: 'Dashboard', icon: <AiFillHome size={18} />, roles: ['Manager', 'Admin', 'Customer'] },
  { path: '/customers', label: 'Khách hàng', icon: <MdOutlinePeopleAlt size={18} />, roles: ['Manager', 'Admin'] },
  { path: '/rooms', label: 'Phòng', icon: <MdOutlineMeetingRoom size={18} />, roles: ['Manager', 'Admin'] },
  { path: '/bookings', label: 'Đặt phòng', icon: <MdOutlineEventAvailable size={18} />, roles: ['Manager', 'Admin', 'Customer'] },
  { path: '/requests', label: 'Quản lý yêu cầu', icon: <MdOutlineAssignment size={18} />, roles: ['Manager', 'Admin'] },
  { path: '/employees', label: 'Nhân viên', icon: <MdOutlinePersonOutline size={18} />, roles: ['Manager'] },
  { path: '/statistics', label: 'Thống kê', icon: <MdOutlineBarChart size={18} />, roles: ['Manager'] },
];

const adminMenuConfig = [
  { path: '/customers', label: 'Khách hàng', icon: <MdOutlinePeopleAlt size={18} />, roles: ['Manager', 'Admin'] },
  { path: '/rooms', label: 'Phòng', icon: <MdOutlineMeetingRoom size={18} />, roles: ['Manager', 'Admin'] },
  { path: '/bookings', label: 'Đặt phòng', icon: <MdOutlineEventAvailable size={18} />, roles: ['Manager', 'Admin', 'Customer'] },
  { path: '/requests', label: 'Quản lý yêu cầu', icon: <MdOutlineAssignment size={18} />, roles: ['Manager', 'Admin'] },
];

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarNavRef = useRef(null);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const hasPermission = (roles) => {
    return roles.includes(user?.role);
  };

  // YouTube-style smooth scrolling
  useEffect(() => {
    const navElement = sidebarNavRef.current;
    if (!navElement) return;

    let isScrolling = false;
    let scrollTimeout;

    const handleWheel = (e) => {
      e.preventDefault();
      
      if (!isScrolling) {
        isScrolling = true;
        navElement.style.scrollBehavior = 'smooth';
      }

      navElement.scrollTop += e.deltaY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        navElement.style.scrollBehavior = 'auto';
      }, 150);
    };

    navElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      navElement.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const filteredMenu = user?.role === 'Manager' ? menuConfig : adminMenuConfig;

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Hotel Management</h3>
      </div>
      
      <Nav ref={sidebarNavRef} className={`${styles.sidebarNav}`}>
        {filteredMenu.map((item) => (
          hasPermission(item.roles) && (
            <Nav.Item key={item.path} className={styles.navItem}>
              <Nav.Link
                className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Nav.Link>
            </Nav.Item>
          )
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
