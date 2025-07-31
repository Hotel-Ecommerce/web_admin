import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaSearch, FaPlus, FaFilter, FaDownload, FaSync } from 'react-icons/fa';
import styles from './BookingFilterBar.module.scss';

const BookingFilterBar = ({ 
  search, 
  setSearch, 
  onAddBooking, 
  onFilter, 
  onExport, 
  onReload, 
  activeFiltersCount = 0 
}) => (
  <Row className={styles.filterBar + ' mb-3'}>
    <Col md={6}>
      <div className="position-relative">
        <Form.Control
          type="text"
          placeholder="🔍 Tìm kiếm theo mã booking, khách hàng, phòng..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ 
            background: '#fff', 
            color: '#1C1C1E', 
            border: '1.5px solid #e9ecef', 
            borderRadius: 8,
            paddingLeft: '2.5rem'
          }}
        />
        <FaSearch 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6c757d'
          }} 
        />
      </div>
    </Col>
    <Col md={6} className="d-flex justify-content-end gap-2">
      <Button
        variant="outline-secondary"
        onClick={onFilter}
        style={{
          border: '1.5px solid #e9ecef',
          borderRadius: 8,
          padding: '0.5rem',
          width: '40px',
          height: '40px',
          background: '#fff',
          color: '#6c757d',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#f8f9fa'}
        onMouseOut={e => e.currentTarget.style.background = '#fff'}
        title="Lọc"
      >
        <FaFilter />
        {activeFiltersCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {activeFiltersCount}
          </span>
        )}
      </Button>
      <Button
        variant="outline-success"
        onClick={onExport}
        style={{
          border: '1.5px solid #28a745',
          borderRadius: 8,
          padding: '0.5rem',
          width: '40px',
          height: '40px',
          background: '#fff',
          color: '#28a745',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#28a745'}
        onMouseOut={e => e.currentTarget.style.background = '#fff'}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#28a745'}
        title="Xuất dữ liệu"
      >
        <FaDownload />
      </Button>
      <Button
        variant="outline-info"
        onClick={onReload}
        style={{
          border: '1.5px solid #17a2b8',
          borderRadius: 8,
          padding: '0.5rem',
          width: '40px',
          height: '40px',
          background: '#fff',
          color: '#17a2b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#17a2b8'}
        onMouseOut={e => e.currentTarget.style.background = '#fff'}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#17a2b8'}
        title="Làm mới"
      >
        <FaSync />
      </Button>
      <Button
        variant="primary"
        onClick={onAddBooking}
        style={{
          background: '#00AEEF',
          border: 'none',
          borderRadius: 8,
          padding: '0.5rem',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#0095c8'}
        onMouseOut={e => e.currentTarget.style.background = '#00AEEF'}
        title="Thêm booking"
      >
        <FaPlus />
      </Button>
    </Col>
  </Row>
);

export default BookingFilterBar; 