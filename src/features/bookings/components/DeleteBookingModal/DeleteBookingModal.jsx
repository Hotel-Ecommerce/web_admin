import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { FaExclamationTriangle, FaCalendarAlt, FaUser, FaBed, FaMoneyBillWave } from 'react-icons/fa';
import { deleteBooking } from '../../BookingAPI';
import styles from './DeleteBookingModal.module.scss';
import { formatDate } from '../../../../utils/dateUtils';

const DeleteBookingModal = ({ show, onHide, booking, token, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show || !booking) return null;

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

  const calculateDuration = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return 0;
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteBooking(booking._id, token);
      if (onDeleted) onDeleted();
      onHide();
    } catch (err) {
      setError(err?.response?.data?.message || 'Xóa booking thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className={styles['delete-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          Xác nhận xóa booking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-3">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '2rem',
            color: 'white'
          }}>
            ⚠️
          </div>
        </div>

        <Alert variant="danger">
          <strong>⚠️ Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả thông tin booking sẽ bị xóa vĩnh viễn.
        </Alert>

        <div className="p-3 bg-light rounded">
          <h6 className="mb-3">Thông tin booking sẽ bị xóa:</h6>
          
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
                  <FaCalendarAlt className="text-primary me-2" />
                  <strong>Ngày check-in:</strong>
                </div>
                <p className="mb-0 ms-4">
                  {booking.checkInDate ? formatDate(booking.checkInDate) : 'Chưa có'}
                </p>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaCalendarAlt className="text-primary me-2" />
                  <strong>Ngày check-out:</strong>
                </div>
                <p className="mb-0 ms-4">
                  {booking.checkOutDate ? formatDate(booking.checkOutDate) : 'Chưa có'}
                </p>
              </div>
            </Col>
          </Row>
          
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
          
          {booking.numberOfGuests && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <strong>Số lượng khách:</strong>
              </div>
              <p className="mb-0 ms-4">{booking.numberOfGuests} người</p>
            </div>
          )}
          
          {booking.totalPrice && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <FaMoneyBillWave className="text-primary me-2" />
                <strong>Tổng tiền:</strong>
              </div>
              <p className="mb-0 ms-4">{formatPrice(booking.totalPrice)}</p>
            </div>
          )}
          
          {booking.createdAt && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <strong>Ngày tạo booking:</strong>
              </div>
              <p className="mb-0 ms-4">{formatDate(booking.createdAt)}</p>
            </div>
          )}
        </div>

        {booking.status === 'Confirmed' && (
          <Alert variant="warning" className="mt-3">
            <strong>Lưu ý:</strong> Booking này đã được xác nhận. Việc xóa có thể ảnh hưởng đến lịch trình của khách hàng.
          </Alert>
        )}

        {booking.paymentStatus === 'Paid' && (
          <Alert variant="warning" className="mt-3">
            <strong>Lưu ý:</strong> Booking này đã được thanh toán. Cần xử lý hoàn tiền cho khách hàng trước khi xóa.
          </Alert>
        )}
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
            'Xóa booking'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBookingModal; 