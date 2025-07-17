import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import styles from './RoomDetailModal.module.scss';
import { API_URL } from '../../../../core/constant/api_constant';

const RoomDetailModal = ({ show, onHide, room }) => {
  if (!room) return null;
  return (
    <Modal show={show} onHide={onHide} centered className={styles.roomDetailModal}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Số phòng:</strong> {room.roomNumber}</p>
        <p><strong>Loại:</strong> {room.type}</p>
        <p><strong>Giá:</strong> {room.price} VNĐ</p>
        <p><strong>Sức chứa:</strong> {room.capacity}</p>
        <p><strong>Mô tả:</strong> {room.description || 'Chưa cập nhật'}</p>
        <div style={{ marginTop: 12 }}>
          <strong>Hình ảnh:</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {room.images && room.images.length > 0 ? (
              room.images.map((img, idx) => (
                <Image key={idx} src={img.startsWith('http') ? img : `${API_URL}${img}`} thumbnail style={{ width: 80, height: 80, objectFit: 'cover' }} />
              ))
            ) : (
              <span>Không có hình ảnh</span>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomDetailModal; 