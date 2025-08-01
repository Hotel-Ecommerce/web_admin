import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle, FaBed, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import styles from './DeleteRoomModal.module.scss';

const DeleteRoomModal = ({ show, onHide, room, onDelete, loading = false }) => {
  const [error, setError] = useState('');

  if (!room) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'Standard': return 'Tiêu chuẩn';
      case 'Deluxe': return 'Cao cấp';
      case 'Suite': return 'Hạng sang';
      default: return type;
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await onDelete(room._id);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi xóa phòng');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-room-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          Xác nhận xóa phòng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-3">
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fff3cd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '2rem',
            color: '#856404'
          }}>
            ⚠️
          </div>
        </div>

        <Alert variant="warning">
          <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Tất cả thông tin và hình ảnh của phòng sẽ bị xóa vĩnh viễn.
        </Alert>

        <div className="p-3 bg-light rounded">
          <h6 className="mb-3">Thông tin phòng sẽ bị xóa:</h6>
          
          <div className="d-flex align-items-center mb-2">
            <FaBed className="text-primary me-2" />
            <strong>Số phòng:</strong> {room.roomNumber}
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-info me-2">{getTypeName(room.type)}</span>
            <strong>Loại phòng:</strong> {getTypeName(room.type)}
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <FaMoneyBillWave className="text-success me-2" />
            <strong>Giá:</strong> {formatPrice(room.price)}
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <FaUsers className="text-primary me-2" />
            <strong>Sức chứa:</strong> {room.capacity} người
          </div>
          
          {room.description && (
            <div className="mt-2">
              <strong>Mô tả:</strong> {room.description}
            </div>
          )}
          
          {room.images && room.images.length > 0 && (
            <div className="mt-2">
              <strong>Hình ảnh:</strong> {room.images.length} file
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang xóa...
            </>
          ) : (
            'Xóa phòng'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteRoomModal;
