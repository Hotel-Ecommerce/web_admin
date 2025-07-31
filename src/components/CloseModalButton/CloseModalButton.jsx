import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './CloseModalButton.module.scss';

const CloseModalButton = ({ onClick, style, ariaLabel = 'Đóng', className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`${styles.closeButton} ${className}`}
    style={style}
  >
    <FaTimes />
  </button>
);

export default CloseModalButton; 