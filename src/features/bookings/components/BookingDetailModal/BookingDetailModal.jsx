import React from 'react';
import { Modal, Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaUser, FaBed, FaMoneyBillWave, FaCreditCard, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './BookingDetailModal.module.scss';
import { formatDate } from '../../../../utils/dateUtils';

const BookingDetailModal = ({ open, onClose, booking }) => {
  if (!open || !booking) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge bg="success">Đã xác nhận</Badge>;
      case 'Pending':
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">Đã hủy</Badge>;
      case 'Completed':
        return <Badge bg="info">Hoàn thành</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge bg="success">Đã thanh toán</Badge>;
      case 'Unpaid':
        return <Badge bg="danger">Chưa thanh toán</Badge>;
      case 'Pending':
        return <Badge bg="warning">Chờ xử lý</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    if (!booking.roomId?.price || !booking.checkInDate || !booking.checkOutDate) {
      return booking.totalPrice || 0;
    }
    const duration = calculateDuration(booking.checkInDate, booking.checkOutDate);
    return booking.roomId.price * duration;
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" centered className={styles['booking-detail-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCalendarAlt className="me-2" />
          Chi tiết đặt phòng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            {/* Thông tin cơ bản */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Thông tin đặt phòng
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaUser className="text-primary me-2" />
                        <strong>Khách hàng:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        {booking.customerId?.fullName || 'Không có thông tin'}
                      </p>
                      {booking.customerId?.email && (
                        <small className="text-muted ms-4">
                          {booking.customerId.email}
                        </small>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaBed className="text-primary me-2" />
                        <strong>Phòng:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        {booking.roomId?.roomNumber || 'Không có thông tin'}
                      </p>
                      {booking.roomId?.type && (
                        <small className="text-muted ms-4">
                          {booking.roomId.type}
                        </small>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="text-primary me-2" />
                        <strong>Ngày check-in:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        {booking.checkInDate ? formatDate(booking.checkInDate) : 'Chưa có'}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="text-primary me-2" />
                        <strong>Ngày check-out:</strong>
                      </div>
                      <p className="mb-0 ms-4">
                        {booking.checkOutDate ? formatDate(booking.checkOutDate) : 'Chưa có'}
                      </p>
                    </div>
                  </Col>
                </Row>
                
                {booking.numberOfGuests && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <strong>Số lượng khách:</strong>
                    </div>
                    <p className="mb-0 ms-4">{booking.numberOfGuests} người</p>
                  </div>
                )}
                
                {booking.specialRequests && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <strong>Yêu cầu đặc biệt:</strong>
                    </div>
                    <p className="mb-0 ms-4">{booking.specialRequests}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Thông tin trạng thái */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaCheckCircle className="me-2" />
                  Trạng thái và thanh toán
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Trạng thái booking:</strong>
                      </div>
                      <div className="ms-4">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Trạng thái thanh toán:</strong>
                      </div>
                      <div className="ms-4">
                        {getPaymentBadge(booking.paymentStatus)}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                {booking.createdAt && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <strong>Ngày tạo booking:</strong>
                    </div>
                    <p className="mb-0 ms-4">{formatDate(booking.createdAt)}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            {/* Thông tin giá */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaMoneyBillWave className="me-2" />
                  Thông tin giá
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
                      💰
                    </div>
                    <h4 className="mt-2 mb-1">{formatPrice(calculateTotalPrice())}</h4>
                    <small className="text-muted">Tổng tiền</small>
                  </div>
                  
                  {booking.roomId?.price && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Giá phòng/đêm</small>
                        <small>{formatPrice(booking.roomId.price)}</small>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <small>Số đêm</small>
                        <small>{calculateDuration(booking.checkInDate, booking.checkOutDate)} đêm</small>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Tổng cộng</strong>
                        <strong>{formatPrice(calculateTotalPrice())}</strong>
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
                  <small className="text-muted">Mã booking:</small>
                  <p className="mb-0 font-monospace small">{booking._id}</p>
                </div>
                
                {booking.updatedAt && (
                  <div className="mb-2">
                    <small className="text-muted">Cập nhật lần cuối:</small>
                    <p className="mb-0 small">{formatDate(booking.updatedAt)}</p>
                  </div>
                )}
                
                {booking.roomId?.capacity && (
                  <div className="mb-2">
                    <small className="text-muted">Sức chứa phòng:</small>
                    <p className="mb-0 small">{booking.roomId.capacity} người</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal; 