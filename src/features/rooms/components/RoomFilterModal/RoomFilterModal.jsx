import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';
import styles from './RoomFilterModal.module.scss';

const RoomFilterModal = ({ show, onHide, onApplyFilters, onResetFilters, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priceRange: 'all',
    capacity: 'all',
    sortBy: 'roomNumber'
  });

  // Load saved filters when modal opens
  useEffect(() => {
    if (show) {
      const savedFilters = localStorage.getItem('roomFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      } else {
        // Reset to default if no saved filters
        setFilters({
          type: 'all',
          status: 'all',
          priceRange: 'all',
          capacity: 'all',
          sortBy: 'roomNumber'
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
      type: 'all',
      status: 'all',
      priceRange: 'all',
      capacity: 'all',
      sortBy: 'roomNumber'
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
    if (filters.type !== 'all') {
             const typeLabels = {
         'Standard': 'Tiêu chuẩn',
         'Deluxe': 'Cao cấp',
         'Suite': 'Hạng sang'
       };
      activeFilters.push(`Loại: ${typeLabels[filters.type] || filters.type}`);
    }
    if (filters.status !== 'all') {
             const statusLabels = {
         'available': 'Trống',
         'occupied': 'Đã thuê'
       };
      activeFilters.push(`Trạng thái: ${statusLabels[filters.status] || filters.status}`);
    }
    if (filters.priceRange !== 'all') {
      const priceLabels = {
        'low': 'Dưới 500k',
        'medium': '500k - 1M',
        'high': 'Trên 1M'
      };
      activeFilters.push(`Giá: ${priceLabels[filters.priceRange] || filters.priceRange}`);
    }
    if (filters.capacity !== 'all') {
      activeFilters.push(`Sức chứa: ${filters.capacity} người`);
    }
    if (filters.sortBy !== 'roomNumber') {
      const sortLabels = {
        'price_asc': 'Giá tăng dần',
        'price_desc': 'Giá giảm dần',
        'capacity_asc': 'Sức chứa tăng dần',
        'capacity_desc': 'Sức chứa giảm dần',
        'createdAt_asc': 'Thời gian tạo tăng dần',
        'createdAt_desc': 'Thời gian tạo giảm dần',
        'updatedAt_asc': 'Thời gian cập nhật tăng dần',
        'updatedAt_desc': 'Thời gian cập nhật giảm dần'
      };
      activeFilters.push(`Sắp xếp: ${sortLabels[filters.sortBy] || filters.sortBy}`);
    }

    return activeFilters.join(', ');
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span>🔍 Bộ lọc phòng</span>
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
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">Tất cả loại phòng</option>
                                 <option value="Standard">Tiêu chuẩn</option>
                 <option value="Deluxe">Cao cấp</option>
                 <option value="Suite">Hạng sang</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                                 <option value="all">Tất cả trạng thái</option>
                 <option value="available">Trống</option>
                 <option value="occupied">Đã thuê</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Khoảng giá</Form.Label>
              <Form.Select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">Tất cả giá</option>
                <option value="low">Dưới 500k</option>
                <option value="medium">500k - 1M</option>
                <option value="high">Trên 1M</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sức chứa</Form.Label>
              <Form.Select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
              >
                                 <option value="all">Tất cả sức chứa</option>
                 <option value="1">1 người</option>
                 <option value="2">2 người</option>
                 <option value="3">3 người</option>
                 <option value="4">4 người</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Sắp xếp theo</Form.Label>
              <Form.Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="roomNumber">Số phòng (A-Z)</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="capacity_asc">Sức chứa tăng dần</option>
                <option value="capacity_desc">Sức chứa giảm dần</option>
                <option value="createdAt_asc">Thời gian tạo tăng dần</option>
                <option value="createdAt_desc">Thời gian tạo giảm dần</option>
                <option value="updatedAt_asc">Thời gian cập nhật tăng dần</option>
                <option value="updatedAt_desc">Thời gian cập nhật giảm dần</option>
              </Form.Select>
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

export default RoomFilterModal; 