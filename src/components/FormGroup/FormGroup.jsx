import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './FormGroup.module.scss';

const FormGroup = ({ children, className, ...props }) => {
  return (
    <Form.Group className={`${styles.group} ${className || ''}`} {...props}>
      {children}
    </Form.Group>
  );
};

export default FormGroup;
