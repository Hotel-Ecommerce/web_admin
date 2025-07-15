import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import styles from './RoomFilterBar.module.scss';

const RoomFilterBar = ({ search, setSearch }) => (
  <Row className={styles.filterBar + ' mb-3'}>
    <Col md={6}>
      <Form.Control
        type="text"
        placeholder="Tìm kiếm theo số phòng, loại phòng, mô tả..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #e9ecef', borderRadius: 8 }}
      />
    </Col>
  </Row>
);

export default RoomFilterBar; 