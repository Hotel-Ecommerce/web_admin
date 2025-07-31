import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';
import styles from './CustomerFilterModal.module.scss';

const CustomerFilterModal = ({ show, onHide, onApplyFilters, onResetFilters, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    searchType: 'all',
    sortBy: 'createdAt',
    startDate: '',
    endDate: ''
  });

  // Load saved filters when modal opens
  useEffect(() => {
    if (show) {
      const savedFilters = localStorage.getItem('customerFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      } else {
        // Reset to default if no saved filters
        setFilters({
          searchType: 'all',
          sortBy: 'createdAt',
          startDate: '',
          endDate: ''
        });
      }
    }
  }, [show]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    // Chỉ lưu và áp dụng khi nhấn "Áp dụng"
    onApplyFilters(filters);
    onHide();
  };

  const handleCancel = () => {
    // Không lưu khi nhấn "Hủy" hoặc "X"
    onHide();
  };

  const handleReset = () => {
    const resetFilters = {
      searchType: 'all',
      sortBy: 'createdAt',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    onResetFilters();
    onHide();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== 'all' && value !== '').length;
  };

  // Get filter description
  const getFilterDescription = () => {
    const activeFilters = [];
    if (filters.sortBy !== 'createdAt') {
      const sortLabels = {
        'createdAt_asc': 'Ngày tạo (cũ nhất)',
        'fullName': 'Tên (A-Z)',
        'fullName_desc': 'Tên (Z-A)',
        'email': 'Email (A-Z)',
        'email_desc': 'Email (Z-A)'
      };
      activeFilters.push(`Sắp xếp: ${sortLabels[filters.sortBy] || filters.sortBy}`);
    }
    if (filters.startDate || filters.endDate) {
      activeFilters.push(`Khoảng thời gian: ${filters.startDate || 'Từ đầu'} - ${filters.endDate || 'Đến nay'}`);
    }
    return activeFilters.join(', ');
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header>
        <Modal.Title>
          <span>🔍 Bộ lọc khách hàng</span>
          {getActiveFiltersCount() > 0 && (
            <Badge bg="primary" className="ms-2">
              {getActiveFiltersCount()} bộ lọc
            </Badge>
          )}
        </Modal.Title>
        <CloseModalButton onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        {getActiveFiltersCount() > 0 && (
          <div className="mb-3 p-2 bg-light rounded">
            <small className="text-muted">
              <strong>Bộ lọc hiện tại:</strong> {getFilterDescription()}
            </small>
          </div>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loại tìm kiếm</Form.Label>
              <Form.Select
                value={filters.searchType}
                onChange={(e) => handleFilterChange('searchType', e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="name">Theo tên</option>
                <option value="email">Theo email</option>
                <option value="phone">Theo số điện thoại</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sắp xếp theo</Form.Label>
              <Form.Select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Ngày tạo (mới nhất)</option>
                <option value="createdAt_asc">Ngày tạo (cũ nhất)</option>
                <option value="fullName">Tên (A-Z)</option>
                <option value="fullName_desc">Tên (Z-A)</option>
                <option value="email">Email (A-Z)</option>
                <option value="email_desc">Email (Z-A)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Khoảng thời gian tùy chỉnh</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="date"
                    placeholder="Từ ngày"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="date"
                    placeholder="Đến ngày"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleReset}>
          🔄 Đặt lại
        </Button>
        <Button variant="outline-primary" onClick={handleCancel}>
          ❌ Hủy
        </Button>
        <Button variant="primary" onClick={handleApply}>
          ✅ Áp dụng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerFilterModal; 