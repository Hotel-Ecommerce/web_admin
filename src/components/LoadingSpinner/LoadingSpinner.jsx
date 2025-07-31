import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({ 
  size = 'border', 
  variant = 'primary', 
  text = 'Đang tải...',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const spinnerContent = (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <Spinner 
        animation={size} 
        variant={variant} 
        className={styles.spinner}
      />
      {text && (
        <div className={styles.spinnerText}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={styles.overlay}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner; 