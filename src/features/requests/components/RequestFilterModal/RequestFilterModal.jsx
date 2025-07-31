import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaFilter, FaTimes, FaCheck, FaSyncAlt } from 'react-icons/fa';
import styles from './RequestFilterModal.module.scss';

const RequestFilterModal = ({ 
  show, 
  onClose, 
  onApply, 
  initialFilter = {},
  customers = []
}) => {
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    customerId: '',
    dateRange: '',
    ...initialFilter
  });

  const [tempFilter, setTempFilter] = useState(filter);

  useEffect(() => {
    setTempFilter(filter);
  }, [filter]);

  const handleInputChange = (field, value) => {
    setTempFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    const resetFilter = {
      status: '',
      type: '',
      customerId: '',
      dateRange: ''
    };
    setTempFilter(resetFilter);
    setFilter(resetFilter);
  };

  const handleApply = () => {
    setFilter(tempFilter);
    onApply(tempFilter);
    onClose();
  };

  const handleClose = () => {
    setTempFilter(filter);
    onClose();
  };

  const hasActiveFilters = () => {
    return Object.values(tempFilter).some(value => value !== '');
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      className={styles.filterModal}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>
          <FaFilter className={styles.filterIcon} />
          Bộ lọc nâng cao
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className={styles.modalBody}>
        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={tempFilter.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={styles.formControl}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Đang chờ</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Disapproved">Đã từ chối</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Loại yêu cầu</Form.Label>
              <Form.Select
                value={tempFilter.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={styles.formControl}
              >
                <option value="">Tất cả loại</option>
                <option value="Update">Cập nhật</option>
                <option value="Cancel">Hủy bỏ</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Khách hàng</Form.Label>
              <Form.Select
                value={tempFilter.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className={styles.formControl}
              >
                <option value="">Tất cả khách hàng</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.fullName} - {customer.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Khoảng thời gian</Form.Label>
              <Form.Select
                value={tempFilter.dateRange}
                onChange={(e) => handleInputChange('dateRange', e.target.value)}
                className={styles.formControl}
              >
                <option value="">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className={styles.filterSummary}>
          <h6>Bộ lọc hiện tại:</h6>
          <div className={styles.activeFilters}>
            {tempFilter.status && (
              <span className={styles.filterTag}>
                Trạng thái: {tempFilter.status}
              </span>
            )}
            {tempFilter.type && (
              <span className={styles.filterTag}>
                Loại: {tempFilter.type}
              </span>
            )}
            {tempFilter.customerId && (
              <span className={styles.filterTag}>
                Khách hàng: {customers.find(c => c._id === tempFilter.customerId)?.fullName || 'N/A'}
              </span>
            )}
            {tempFilter.dateRange && (
              <span className={styles.filterTag}>
                Thời gian: {tempFilter.dateRange}
              </span>
            )}
            {!hasActiveFilters() && (
              <span className={styles.noFilters}>Không có bộ lọc nào</span>
            )}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className={styles.modalFooter}>
        <Button 
          variant="outline-secondary" 
          onClick={handleReset}
          className={styles.resetBtn}
        >
          <FaSyncAlt size={14} />
          Đặt lại
        </Button>
        
        <div className={styles.actionButtons}>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className={styles.cancelBtn}
          >
            <FaTimes size={14} />
            Hủy
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleApply}
            className={styles.applyBtn}
            disabled={!hasActiveFilters()}
          >
            <FaCheck size={14} />
            Áp dụng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestFilterModal; 