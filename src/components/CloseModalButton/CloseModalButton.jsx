import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CloseModalButton = ({ onClick, style, ariaLabel = 'Đóng' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      position: 'absolute',
      right: 16,
      top: 12,
      padding: 0,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      ...style
    }}
  >
    <FaTimes color="#d32f2f" size={22} />
  </button>
);

export default CloseModalButton; 