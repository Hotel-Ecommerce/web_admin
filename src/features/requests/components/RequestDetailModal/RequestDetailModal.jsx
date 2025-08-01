import React from 'react';
import { Modal, Button, Row, Col, Badge, Card, Alert } from 'react-bootstrap';
import { FaUser, FaCalendar, FaHotel, FaExchangeAlt, FaTimes, FaCheck, FaClock, FaMoneyBillWave, FaEdit, FaBan } from 'react-icons/fa';
import styles from './RequestDetailModal.module.scss';
import { StatusBadge } from '../../../../components';
import { formatDateTime } from '../../../../utils/dateUtils';

const RequestDetailModal = ({ show, onHide, request, onApprove, onDisapprove, loading = false }) => {
  if (!request) return null;

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'change':
        return <FaExchangeAlt className="text-primary" />;
      case 'cancel':
        return <FaTimes className="text-danger" />;
      default:
        return <FaCheck className="text-success" />;
    }
  };

  const getRequestTypeText = (type) => {
    switch (type) {
      case 'change':
        return 'Thay đổi booking';
      case 'cancel':
        return 'Hủy booking';
      default:
        return 'Yêu cầu khác';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Đang chờ</Badge>;
      case 'Approved':
        return <Badge bg="success">Đã duyệt</Badge>;
      case 'Disapproved':
        return <Badge bg="danger">Đã từ chối</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className={styles.requestDetailModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            {getRequestTypeIcon(request.type)}
            <span className="ms-2">Chi tiết yêu cầu</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {request.status === 'Pending' && (
          <Alert variant="info" className="mb-3">
            <FaClock className="me-2" />
            <strong>Yêu cầu đang chờ xử lý</strong>
            <br />
            Vui lòng xem xét và đưa ra quyết định phù hợp.
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaUser className="me-2" />
                  Thông tin khách hàng
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Tên khách hàng:</strong>
                  </div>
                  <p className="mb-0 ms-3">{request.customerName || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Email:</strong>
                  </div>
                  <p className="mb-0 ms-3">
                    <a href={`mailto:${request.customerEmail}`} className="text-decoration-none">
                      {request.customerEmail || 'N/A'}
                    </a>
                  </p>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Số điện thoại:</strong>
                  </div>
                  <p className="mb-0 ms-3">
                    <a href={`tel:${request.customerPhone}`} className="text-decoration-none">
                      {request.customerPhone || 'N/A'}
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaHotel className="me-2" />
                  Thông tin booking
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Mã booking:</strong>
                  </div>
                  <p className="mb-0 ms-3 font-monospace">{request.bookingId || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Phòng:</strong>
                  </div>
                  <p className="mb-0 ms-3">{request.roomNumber || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Check-in:</strong>
                  </div>
                  <p className="mb-0 ms-3">{formatDateTime(request.checkInDate)}</p>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Check-out:</strong>
                  </div>
                  <p className="mb-0 ms-3">{formatDateTime(request.checkOutDate)}</p>
                </div>
                {request.totalPrice && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <FaMoneyBillWave className="text-primary me-1" />
                      <strong>Tổng tiền:</strong>
                    </div>
                    <p className="mb-0 ms-3">{formatPrice(request.totalPrice)}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaExchangeAlt className="me-2" />
                  Chi tiết yêu cầu
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Loại yêu cầu:</strong>
                      </div>
                      <div className="ms-3">
                        <Badge bg={request.type === 'cancel' ? 'danger' : 'primary'}>
                          {getRequestTypeText(request.type)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Lý do:</strong>
                      </div>
                      <p className="mb-0 ms-3">{request.reason || 'Không có lý do'}</p>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Trạng thái:</strong>
                      </div>
                      <div className="ms-3">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    {request.changes && Object.keys(request.changes).length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <FaEdit className="text-primary me-1" />
                          <strong>Thay đổi đề xuất:</strong>
                        </div>
                        <div className="ms-3">
                          {Object.entries(request.changes).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <small className="text-muted">{key}:</small>
                              <br />
                              <span className="badge bg-light text-dark">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <FaCalendar className="me-2" />
                  Thông tin thời gian
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <strong>Ngày tạo:</strong>
                  </div>
                  <p className="mb-0 ms-3">{formatDateTime(request.createdAt)}</p>
                </div>
                {request.updatedAt && request.updatedAt !== request.createdAt && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <strong>Ngày cập nhật:</strong>
                    </div>
                    <p className="mb-0 ms-3">{formatDateTime(request.updatedAt)}</p>
                  </div>
                )}
                {request.processedAt && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <strong>Ngày xử lý:</strong>
                    </div>
                    <p className="mb-0 ms-3">{formatDateTime(request.processedAt)}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Thông tin xử lý</h6>
              </Card.Header>
              <Card.Body>
                {request.processedBy && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <strong>Xử lý bởi:</strong>
                    </div>
                    <p className="mb-0 ms-3">{request.processedBy}</p>
                  </div>
                )}
                {request.notes && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <strong>Ghi chú:</strong>
                    </div>
                    <p className="mb-0 ms-3">{request.notes}</p>
                  </div>
                )}
                {request.status === 'Disapproved' && request.rejectionReason && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <FaBan className="text-danger me-1" />
                      <strong>Lý do từ chối:</strong>
                    </div>
                    <p className="mb-0 ms-3 text-danger">{request.rejectionReason}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Đóng
        </Button>
        {request.status === 'Pending' && (
          <>
            <Button 
              variant="success" 
              onClick={() => onApprove(request._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaCheck className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaCheck className="me-2" />
                  Phê duyệt
                </>
              )}
            </Button>
            <Button 
              variant="danger" 
              onClick={() => onDisapprove(request._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaTimes className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaTimes className="me-2" />
                  Từ chối
                </>
              )}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RequestDetailModal; 