import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './DeleteRoomModal.module.scss';

const DeleteRoomModal = ({ show, onHide, room, onDelete }) => {
  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-room-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá phòng <strong>{room.name}</strong>?</p>
        <p>Loại: {room.type}</p>
        <p>Giá: {room.price} VNĐ</p>
        <p>Trạng thái: {room.status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Huỷ</Button>
        <Button variant="danger" onClick={() => onDelete(room.id)}>Xoá</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteRoomModal;
