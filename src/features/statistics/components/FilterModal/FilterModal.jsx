import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import styles from './FilterModal.module.scss';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Pending', label: 'Chờ xác nhận' },
];

const FilterModal = ({ show, onClose, onApply, rooms = [], customers = [], employees = [],
  defaultFilter = {} }) => {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [filter, setFilter] = useState({
    startDate: weekAgo,
    endDate: today,
    groupBy: 'day',
    roomType: '',
    status: '',
    ...defaultFilter
  });

  useEffect(() => {
    setFilter(f => ({ ...f, ...defaultFilter }));
  }, [defaultFilter, show]);

  const roomTypes = Array.from(new Set(rooms.map(r => r.type).filter(Boolean)));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Bộ lọc thống kê nâng cao</Modal.Title>
        <CloseModalButton onClick={onClose} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control type="date" name="startDate" value={filter.startDate} onChange={handleChange} />
            </Col>
            <Col md={6}>
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control type="date" name="endDate" value={filter.endDate} onChange={handleChange} />
            </Col>
            <Col md={6}>
              <Form.Label>Nhóm theo</Form.Label>
              <Form.Select name="groupBy" value={filter.groupBy} onChange={handleChange}>
                <option value="day">Ngày</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select name="roomType" value={filter.roomType} onChange={handleChange}>
                <option value="">Tất cả loại phòng</option>
                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select name="status" value={filter.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button variant="primary" onClick={handleApply}>Áp dụng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal; 