import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AdvancedFilterModal = ({ show, onHide, onApply, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {});

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
    onHide();
  };

  const handleReset = () => {
    setFilters({});
    onApply({});
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Lọc nâng cao</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Loại yêu cầu</Form.Label>
                <Form.Select name="type" value={filters.type || ''} onChange={handleChange}>
                  <option value="">Tất cả</option>
                  <option value="change">Thay đổi</option>
                  <option value="cancel">Hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="status" value={filters.status || ''} onChange={handleChange}>
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Approved">Đã phê duyệt</option>
                  <option value="Disapproved">Đã từ chối</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Ngày tạo từ</Form.Label>
            <Form.Control type="date" name="createdFrom" value={filters.createdFrom || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày tạo đến</Form.Label>
            <Form.Control type="date" name="createdTo" value={filters.createdTo || ''} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReset}>Đặt lại</Button>
        <Button variant="primary" onClick={handleApply}>Áp dụng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdvancedFilterModal; 