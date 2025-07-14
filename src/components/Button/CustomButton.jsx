import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './CustomButton.module.scss';

const CustomButton = ({ children, className, ...props }) => {
  return (
    <Button 
      className={`${styles.custom} ${className || ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
