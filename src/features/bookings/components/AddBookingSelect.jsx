import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import styles from './AddBookingSelect.module.scss';

const AddBookingSelect = ({ customers, rooms, value, onChange }) => {
  return (
    <Row className={styles.addBookingSelectRow}>
      <Col md={6} className="mb-3">
        <Form.Group>
          <Form.Label>Khách hàng *</Form.Label>
          <Form.Select
            name="customerId"
            value={value.customerId}
            onChange={onChange}
            required
          >
            <option value="">Chọn khách hàng</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>
                {c.fullName} {c.phone ? `- ${c.phone}` : ''}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6} className="mb-3">
        <Form.Group>
          <Form.Label>Phòng *</Form.Label>
          <Form.Select
            name="roomId"
            value={value.roomId}
            onChange={onChange}
            required
          >
            <option value="">Chọn phòng</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>
                {r.roomNumber} - {r.type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default AddBookingSelect; 