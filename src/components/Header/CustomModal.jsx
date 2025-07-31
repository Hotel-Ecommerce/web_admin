import React from 'react';
import { Modal } from 'react-bootstrap';
import CloseModalButton from '../CloseModalButton/CloseModalButton';
import './CustomModal.module.scss';

const CustomModal = ({ 
  show, 
  onHide, 
  title, 
  children, 
  size = 'md',
  centered = true,
  className = ''
}) => {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size={size}
      centered={centered}
      className={className}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <CloseModalButton onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal; 