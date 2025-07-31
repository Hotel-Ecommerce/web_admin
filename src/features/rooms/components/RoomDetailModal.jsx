import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { formatDate } from '../../../../utils/dateUtils';

const RoomDetailModal = ({ show, onHide, room }) => {
  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết phòng {room.roomNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <h6>Thông tin cơ bản</h6>
            <p><strong>Số phòng:</strong> {room.roomNumber}</p>
            <p><strong>Loại phòng:</strong> {room.type}</p>
            <p><strong>Giá:</strong> {room.price?.toLocaleString()} VNĐ</p>
            <p><strong>Sức chứa:</strong> {room.capacity} người</p>
            <p><strong>Mô tả:</strong> {room.description || 'Không có mô tả'}</p>
          </Col>
          <Col md={6}>
            <h6>Trạng thái</h6>
            <p><strong>Ngày tạo:</strong> {formatDate(room.createdAt)}</p>
            <p><strong>Cập nhật:</strong> {formatDate(room.updatedAt)}</p>
            <p><strong>Hình ảnh:</strong> {room.images?.length || 0} ảnh</p>
            <p><strong>Booking:</strong> {room.bookedTime?.length || 0} lần</p>
          </Col>
        </Row>
        
        {room.images && room.images.length > 0 && (
          <div className="mt-3">
            <h6>Hình ảnh</h6>
            <div className="d-flex flex-wrap gap-2">
              {room.images.map((image, index) => (
                <img 
                  key={index}
                  src={image.startsWith('http') ? image : `http://localhost:7079${image}`}
                  alt={`Room ${room.roomNumber} - ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ))}
            </div>
          </div>
        )}
        
        {room.bookedTime && room.bookedTime.length > 0 && (
          <div className="mt-3">
            <h6>Lịch đặt phòng</h6>
            <div className="d-flex flex-wrap gap-2">
              {room.bookedTime.map((booking, index) => (
                <Badge key={index} bg="info" className="me-2">
                  {formatDate(booking.start)} - {formatDate(booking.end)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomDetailModal; 