import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import { FaFilter, FaTimes, FaCheck, FaSyncAlt, FaSearch, FaUser, FaCalendar, FaExchangeAlt } from 'react-icons/fa';
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
    console.log('📝 Input changed:', field, '=', value);
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
    console.log('🔄 Resetting filter:', resetFilter);
    setTempFilter(resetFilter);
    setFilter(resetFilter);
    onApply(resetFilter); // Gọi onApply để áp dụng reset ngay lập tức
  };

  const handleApply = () => {
    console.log('🔍 Applying filter:', tempFilter);
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

  const getActiveFiltersCount = () => {
    return Object.values(tempFilter).filter(value => value !== '').length;
  };

  const getFilterDescription = () => {
    const activeFilters = [];
    
    if (tempFilter.status) {
      const statusLabels = {
        'Pending': 'Đang chờ',
        'Approved': 'Đã duyệt',
        'Disapproved': 'Đã từ chối'
      };
      activeFilters.push(`Trạng thái: ${statusLabels[tempFilter.status] || tempFilter.status}`);
    }
    
    if (tempFilter.type) {
      const typeLabels = {
        'Update': 'Cập nhật',
        'Cancel': 'Hủy bỏ'
      };
      activeFilters.push(`Loại: ${typeLabels[tempFilter.type] || tempFilter.type}`);
    }
    
    if (tempFilter.customerId) {
      const customer = customers.find(c => c._id === tempFilter.customerId);
      activeFilters.push(`Khách hàng: ${customer?.fullName || 'N/A'}`);
    }
    
    if (tempFilter.dateRange) {
      const dateLabels = {
        'today': 'Hôm nay',
        'week': 'Tuần này',
        'month': 'Tháng này',
        'quarter': 'Quý này',
        'year': 'Năm nay'
      };
      activeFilters.push(`Thời gian: ${dateLabels[tempFilter.dateRange] || tempFilter.dateRange}`);
    }
    
    return activeFilters.join(', ');
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      centered
      className={styles.filterModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <FaFilter className="text-primary me-2" />
            Bộ lọc nâng cao
            {getActiveFiltersCount() > 0 && (
              <Badge bg="primary" className="ms-2">
                {getActiveFiltersCount()} bộ lọc
              </Badge>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {getActiveFiltersCount() > 0 && (
          <Alert variant="info" className="mb-3">
            <FaSearch className="me-2" />
            <strong>Bộ lọc hiện tại:</strong> {getFilterDescription()}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaExchangeAlt className="me-2" />
                Trạng thái
              </Form.Label>
              <Form.Select
                value={tempFilter.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="form-control"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Đang chờ</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Disapproved">Đã từ chối</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaExchangeAlt className="me-2" />
                Loại yêu cầu
              </Form.Label>
              <Form.Select
                value={tempFilter.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="form-control"
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
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2" />
                Khách hàng
              </Form.Label>
              <Form.Select
                value={tempFilter.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className="form-control"
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
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCalendar className="me-2" />
                Khoảng thời gian
              </Form.Label>
              <Form.Select
                value={tempFilter.dateRange}
                onChange={(e) => handleInputChange('dateRange', e.target.value)}
                className="form-control"
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

        <div className="p-3 bg-light rounded">
          <h6 className="mb-2">
            <FaFilter className="me-2" />
            Tóm tắt bộ lọc
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {tempFilter.status && (
              <Badge bg="primary">
                Trạng thái: {tempFilter.status}
              </Badge>
            )}
            {tempFilter.type && (
              <Badge bg="info">
                Loại: {tempFilter.type}
              </Badge>
            )}
            {tempFilter.customerId && (
              <Badge bg="success">
                Khách hàng: {customers.find(c => c._id === tempFilter.customerId)?.fullName || 'N/A'}
              </Badge>
            )}
            {tempFilter.dateRange && (
              <Badge bg="warning">
                Thời gian: {tempFilter.dateRange}
              </Badge>
            )}
            {!hasActiveFilters() && (
              <span className="text-muted">Không có bộ lọc nào được áp dụng</span>
            )}
          </div>
        </div>

        <Alert variant="info" className="mt-3">
          <strong>💡 Lưu ý:</strong>
          <ul className="mb-0 mt-2">
            <li>Có thể kết hợp nhiều bộ lọc để tìm kiếm chính xác hơn</li>
            <li>Bộ lọc sẽ được lưu và áp dụng cho lần tìm kiếm tiếp theo</li>
            <li>Có thể đặt lại để xóa tất cả bộ lọc</li>
          </ul>
        </Alert>
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={handleReset}
          className="me-auto"
        >
          <FaSyncAlt className="me-2" />
          Đặt lại
        </Button>
        
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
        >
          <FaTimes className="me-2" />
          Hủy
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleApply}
          disabled={!hasActiveFilters()}
        >
          <FaCheck className="me-2" />
          Áp dụng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestFilterModal; 