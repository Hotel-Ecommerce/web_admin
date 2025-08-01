// src/features/customers/components/CustomerDetailModal/CustomerDetailModal.jsx
import React from 'react';
import { Modal, Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaCreditCard } from 'react-icons/fa';
import styles from './CustomerDetailModal.module.scss';
import { formatDate } from '../../../../utils/dateUtils';

const CustomerDetailModal = ({ show, onHide, customer }) => {
  if (!customer) return null;

  const formatPhone = (phone) => {
    if (!phone) return 'Chưa cập nhật';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('84')) {
      return `+84 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    } else if (cleaned.startsWith('0')) {
      return `+84 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Đang hoạt động</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Không hoạt động</Badge>;
      default:
        return <Badge bg="info">Chưa xác định</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className={styles['customer-detail-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUser className="me-2" />
          Chi tiết khách hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            {/* Thông tin cơ bản */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaUser className="text-primary me-2" />
                        <strong>Họ và tên:</strong>
                      </div>
                      <p className="mb-0 ms-4">{customer.fullName}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaEnvelope className="text-primary me-2" />
                        <strong>Email:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        <a href={`mailto:${customer.email}`} className="text-decoration-none">
                          {customer.email}
                        </a>
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="text-primary me-2" />
                        <strong>Số điện thoại:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        <a href={`tel:${customer.phone}`} className="text-decoration-none">
                          {formatPhone(customer.phone)}
                        </a>
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaMapMarkerAlt className="text-primary me-2" />
                        <strong>Địa chỉ:</strong>
                      </div>
                      <p className="mb-0 ms-4">{customer.address || 'Chưa cập nhật'}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Thông tin tài khoản */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Thông tin tài khoản
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="text-primary me-2" />
                        <strong>Ngày tạo:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        {customer.createdAt ? formatDate(customer.createdAt) : 'Chưa có thông tin'}
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Trạng thái:</strong>
                      </div>
                      <div className="ms-4">
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            {/* Thống kê */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaHistory className="me-2" />
                  Thống kê
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <div className="mb-3">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#e3f2fd',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontSize: '1.5rem',
                      color: '#1976d2'
                    }}>
                      📋
                    </div>
                    <h4 className="mt-2 mb-1">{customer.bookingCount || 0}</h4>
                    <small className="text-muted">Tổng booking</small>
                  </div>
                  
                  {customer.bookingCount > 0 && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Booking đã xác nhận</small>
                        <small className="text-success">
                          {Math.round((customer.confirmedBookings || 0) / customer.bookingCount * 100)}%
                        </small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ 
                            width: `${(customer.confirmedBookings || 0) / customer.bookingCount * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Thông tin bổ sung */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Thông tin bổ sung</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <small className="text-muted">ID khách hàng:</small>
                  <p className="mb-0 font-monospace small">{customer._id}</p>
                </div>
                
                {customer.updatedAt && (
                  <div className="mb-2">
                    <small className="text-muted">Cập nhật lần cuối:</small>
                    <p className="mb-0 small">{formatDate(customer.updatedAt)}</p>
                  </div>
                )}
                
                {customer.lastLoginAt && (
                  <div className="mb-2">
                    <small className="text-muted">Đăng nhập lần cuối:</small>
                    <p className="mb-0 small">{formatDate(customer.lastLoginAt)}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;
