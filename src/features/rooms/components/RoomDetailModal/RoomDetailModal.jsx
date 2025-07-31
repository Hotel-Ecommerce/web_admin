import React, { useState } from 'react';
import { Modal, Button, Image, Row, Col, Badge } from 'react-bootstrap';
import { FaBed, FaUsers, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import styles from './RoomDetailModal.module.scss';
import { API_URL } from '../../../../core/constant/api_constant';

const RoomDetailModal = ({ show, onHide, room }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!room) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Standard': return '#45B7D1';
      case 'Deluxe': return '#4ECDC4';
      case 'Suite': return '#FF6B6B';
      default: return '#6c757d';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'Standard': return 'Tiêu chuẩn';
      case 'Deluxe': return 'Cao cấp';
      case 'Suite': return 'Hạng sang';
      default: return type;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className={styles.roomDetailModal}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết phòng {room.roomNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            {/* Hình ảnh chính */}
            {room.images && room.images.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <img 
                  src={`http://localhost:7079${room.images[selectedImage]}`}
                  alt={`Phòng ${room.roomNumber}`}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: '#f8f9fa',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  fontSize: '2rem',
                  borderRadius: '12px'
                }}>
                  📷
                </div>
                
                {/* Thumbnails */}
                {room.images.length > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginTop: '12px',
                    overflowX: 'auto'
                  }}>
                    {room.images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={`http://localhost:7079${img}`}
                        alt={`Thumbnail ${idx + 1}`}
                        style={{
                          width: '60px',
                          height: '45px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: idx === selectedImage ? '3px solid #00AEEF' : '1px solid #e9ecef',
                          cursor: 'pointer',
                          opacity: idx === selectedImage ? 1 : 0.7
                        }}
                        onClick={() => setSelectedImage(idx)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '300px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                fontSize: '3rem',
                borderRadius: '12px',
                border: '2px dashed #e9ecef'
              }}>
                📷
              </div>
            )}
          </Col>
          
          <Col md={4}>
            {/* Thông tin phòng */}
            <div style={{ padding: '0 16px' }}>
              <h4 style={{ marginBottom: '20px', color: '#1A202C' }}>
                Phòng {room.roomNumber}
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <Badge 
                  style={{ 
                    background: getTypeColor(room.type),
                    fontSize: '0.9rem',
                    padding: '8px 16px'
                  }}
                >
                  {getTypeName(room.type)}
                </Badge>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaMoneyBillWave style={{ color: '#00AEEF' }} />
                  <span style={{ fontWeight: '600', color: '#2D3748' }}>
                    {formatPrice(room.price)}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaUsers style={{ color: '#00AEEF' }} />
                  <span style={{ color: '#4A5568' }}>
                    Sức chứa: {room.capacity} người
                  </span>
                </div>
              </div>
              
              {room.description && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <FaBed style={{ color: '#00AEEF', marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#2D3748' }}>Mô tả:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#4A5568', fontSize: '0.9rem' }}>
                        {room.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {room.bookedTime && room.bookedTime.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FaCalendarAlt style={{ color: '#00AEEF' }} />
                    <strong style={{ color: '#2D3748' }}>Lịch đặt phòng:</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4A5568' }}>
                    {room.bookedTime.map((booking, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        {new Date(booking.start).toLocaleDateString('vi-VN')} - {new Date(booking.end).toLocaleDateString('vi-VN')}
                      </div>
                    ))}
          </div>
        </div>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomDetailModal; 