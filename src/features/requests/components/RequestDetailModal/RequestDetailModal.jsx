import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FaUser, FaCalendar, FaHotel, FaExchangeAlt, FaTimes, FaCheck } from 'react-icons/fa';
import styles from './RequestDetailModal.module.scss';
import { StatusBadge } from '../../../../components';
import { formatDateTime } from '../../../../utils/dateUtils';

const RequestDetailModal = ({ show, onHide, request }) => {
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



  return (
    <Modal show={show} onHide={onHide} size="lg" className={styles.requestDetailModal}>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>
          <div className={styles.titleContent}>
            <span className={styles.titleIcon}>
              {getRequestTypeIcon(request.type)}
            </span>
            <span>Chi tiết yêu cầu</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className={styles.modalBody}>
        <Row>
          <Col md={6}>
            <div className={styles.infoSection}>
              <h6 className={styles.sectionTitle}>
                <FaUser className="me-2" />
                Thông tin khách hàng
              </h6>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tên khách hàng:</span>
                <span className={styles.value}>{request.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{request.customerEmail}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Số điện thoại:</span>
                <span className={styles.value}>{request.customerPhone}</span>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className={styles.infoSection}>
              <h6 className={styles.sectionTitle}>
                <FaHotel className="me-2" />
                Thông tin booking
              </h6>
              <div className={styles.infoItem}>
                <span className={styles.label}>Mã booking:</span>
                <span className={styles.value}>{request.bookingId}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phòng:</span>
                <span className={styles.value}>{request.roomNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Check-in:</span>
                <span className={styles.value}>{formatDateTime(request.checkInDate)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Check-out:</span>
                <span className={styles.value}>{formatDateTime(request.checkOutDate)}</span>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <div className={styles.infoSection}>
              <h6 className={styles.sectionTitle}>
                <FaExchangeAlt className="me-2" />
                Chi tiết yêu cầu
              </h6>
              <div className={styles.infoItem}>
                <span className={styles.label}>Loại yêu cầu:</span>
                <span className={styles.value}>
                  {getRequestTypeText(request.type)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Lý do:</span>
                <span className={styles.value}>{request.reason}</span>
              </div>
              {request.changes && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Thay đổi đề xuất:</span>
                  <div className={styles.changesList}>
                    {Object.entries(request.changes).map(([key, value]) => (
                      <div key={key} className={styles.changeItem}>
                        <span className={styles.changeLabel}>{key}:</span>
                        <span className={styles.changeValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <div className={styles.infoSection}>
              <h6 className={styles.sectionTitle}>
                <FaCalendar className="me-2" />
                Thông tin thời gian
              </h6>
              <div className={styles.infoItem}>
                <span className={styles.label}>Ngày tạo:</span>
                <span className={styles.value}>{formatDateTime(request.createdAt)}</span>
              </div>
              {request.updatedAt && request.updatedAt !== request.createdAt && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày cập nhật:</span>
                  <span className={styles.value}>{formatDateTime(request.updatedAt)}</span>
                </div>
              )}
              {request.processedAt && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày xử lý:</span>
                  <span className={styles.value}>{formatDateTime(request.processedAt)}</span>
                </div>
              )}
            </div>
          </Col>
          
          <Col md={6}>
            <div className={styles.infoSection}>
              <h6 className={styles.sectionTitle}>
                Trạng thái
              </h6>
              <div className={styles.statusSection}>
                <StatusBadge status={request.status} type="request" showIcon size="lg" />
              </div>
              {request.processedBy && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Xử lý bởi:</span>
                  <span className={styles.value}>{request.processedBy}</span>
                </div>
              )}
              {request.notes && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ghi chú:</span>
                  <span className={styles.value}>{request.notes}</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        {request.status === 'Pending' && (
          <>
            <Button variant="success" onClick={() => console.log('Approve request')}>
              <FaCheck /> Phê duyệt
            </Button>
            <Button variant="danger" onClick={() => console.log('Disapprove request')}>
              <FaTimes /> Từ chối
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RequestDetailModal; 