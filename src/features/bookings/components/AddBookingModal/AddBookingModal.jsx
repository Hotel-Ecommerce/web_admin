import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { addBooking } from '../../BookingAPI';
import { getCustomers } from '../../../customers/CustomerAPI';
import { getRooms } from '../../../rooms/RoomAPI';
import styles from './AddBookingModal.module.scss';
import { FaTimes } from 'react-icons/fa';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';

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

const AddBookingModal = ({ open, onClose, token, onAdded }) => {
  const [form, setForm] = useState({
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      await addBooking(form, token);
      setSuccess('Thêm booking thành công!');
      setForm({ customerId: '', roomId: '', checkInDate: '', checkOutDate: '', status: '', paymentStatus: '' });
      if (onAdded) onAdded();
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1000);
    } catch (err) {
      setError('Có lỗi xảy ra khi thêm booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setForm({ customerId: '', roomId: '', checkInDate: '', checkOutDate: '', status: '', paymentStatus: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Thêm booking mới</Modal.Title>
        <CloseModalButton onClick={handleClose} />
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
            <Button variant="secondary" onClick={handleClose} disabled={loading}>Huỷ</Button>{' '}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBookingModal; 