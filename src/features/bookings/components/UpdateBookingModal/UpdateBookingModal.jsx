import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { updateBooking } from '../../BookingAPI';
import { getCustomers } from '../../../customers/CustomerAPI';
import { getRooms } from '../../../rooms/RoomAPI';
import styles from './UpdateBookingModal.module.scss';

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

const UpdateBookingModal = ({ open, onClose, booking, token, onUpdated }) => {
  const [form, setForm] = useState({
    id: '',
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    status: '',
    paymentStatus: ''
  });
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && token) {
      (async () => {
        try {
          const [customerList, roomList] = await Promise.all([
            getCustomers(token),
            getRooms(token)
          ]);
          setCustomers(Array.isArray(customerList) ? customerList : customerList.customers || []);
          setRooms(Array.isArray(roomList) ? roomList : roomList.rooms || []);
        } catch {
          setCustomers([]);
          setRooms([]);
        }
      })();
    }
  }, [open, token]);

  useEffect(() => {
    if (booking) {
      setForm({
        id: booking._id,
        customerId: booking.customerId?._id || booking.customerId || '',
        roomId: booking.roomId?._id || booking.roomId || '',
        checkInDate: booking.checkInDate ? booking.checkInDate.slice(0,10) : '',
        checkOutDate: booking.checkOutDate ? booking.checkOutDate.slice(0,10) : '',
        status: booking.status || '',
        paymentStatus: booking.paymentStatus || ''
      });
    }
  }, [booking]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.customerId || !form.roomId || !form.checkInDate || !form.checkOutDate) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      await updateBooking(form, token);
      setSuccess('Cập nhật booking thành công!');
      if (onUpdated) onUpdated();
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1000);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật booking.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Khách hàng</Form.Label>
            <Form.Select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
            >
              <option value="">--Chọn khách hàng--</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.fullName} ({c.email})</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phòng</Form.Label>
            <Form.Select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              required
            >
              <option value="">--Chọn phòng--</option>
              {rooms.map(r => (
                <option key={r._id} value={r._id}>{r.roomNumber} ({r.type})</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày nhận</Form.Label>
            <Form.Control
              type="date"
              name="checkInDate"
              value={form.checkInDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày trả</Form.Label>
            <Form.Control
              type="date"
              name="checkOutDate"
              value={form.checkOutDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thanh toán</Form.Label>
            <Form.Select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
            >
              {paymentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onClose} disabled={loading}>Huỷ</Button>{' '}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBookingModal; 