import React from 'react';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Hệ thống quản lý khách sạn</h1>
    </header>
  );
};

export default Header;