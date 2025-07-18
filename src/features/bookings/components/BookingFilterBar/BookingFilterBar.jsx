import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getCustomers } from '../../../customers/CustomerAPI';
import { getRooms } from '../../../rooms/RoomAPI';
import styles from './BookingFilterBar.module.scss';

const paymentOptions = [
  { value: '', label: '--Chọn trạng thái thanh toán--' },
  { value: 'Paid', label: 'Đã thanh toán' },
  { value: 'Unpaid', label: 'Chưa thanh toán' },
  { value: 'Pending', label: 'Chờ xử lý' }
];
const statusOptions = [
  { value: '', label: '--Chọn trạng thái--' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Completed', label: 'Hoàn thành' }
];

const BookingFilterBar = ({ filter, setFilter }) => {
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [customerList, roomList] = await Promise.all([
          getCustomers(),
          getRooms()
        ]);
        setCustomers(Array.isArray(customerList) ? customerList : customerList.customers || []);
        setRooms(Array.isArray(roomList) ? roomList : roomList.rooms || []);
      } catch {
        setCustomers([]);
        setRooms([]);
      }
    })();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form className={styles.filterBar}>
      <Row className="align-items-end g-2">
        <Col md={3}>
          <Form.Label>Khách hàng</Form.Label>
          <Form.Select name="customerId" value={filter.customerId || ''} onChange={handleChange}>
            <option value="">--Chọn khách hàng--</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.fullName} ({c.email})</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label>Phòng</Form.Label>
          <Form.Select name="roomId" value={filter.roomId || ''} onChange={handleChange}>
            <option value="">--Chọn phòng--</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>{r.roomNumber} ({r.type})</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label>Ngày nhận</Form.Label>
          <Form.Control type="date" name="checkInDate" value={filter.checkInDate || ''} onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Form.Label>Ngày trả</Form.Label>
          <Form.Control type="date" name="checkOutDate" value={filter.checkOutDate || ''} onChange={handleChange} />
        </Col>
        <Col md={1}>
          <Form.Label>Trạng thái</Form.Label>
          <Form.Select name="status" value={filter.status || ''} onChange={handleChange}>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label>Thanh toán</Form.Label>
          <Form.Select name="paymentStatus" value={filter.paymentStatus || ''} onChange={handleChange}>
            {paymentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </Form>
  );
};

export default BookingFilterBar; 