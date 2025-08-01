import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaUser, FaBed, FaCalendarAlt, FaCheckCircle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { updateBooking } from '../../BookingAPI';
import { getCustomers } from '../../../customers/CustomerAPI';
import { queryRooms } from '../../../rooms/RoomAPI';
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
    paymentStatus: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (open && token) {
      (async () => {
        try {
          const [customerList, roomList] = await Promise.all([
            getCustomers(token),
            queryRooms(token)
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
        paymentStatus: booking.paymentStatus || '',
        numberOfGuests: booking.numberOfGuests || 1,
        specialRequests: booking.specialRequests || ''
      });
      
      // Set selected room
      const room = rooms.find(r => r._id === (booking.roomId?._id || booking.roomId));
      setSelectedRoom(room);
    }
  }, [booking, rooms]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Update selected room when room changes
    if (name === 'roomId') {
      const room = rooms.find(r => r._id === value);
      setSelectedRoom(room);
    }
  };

  const validateForm = () => {
    if (!form.customerId) {
      setError('Vui lòng chọn khách hàng');
      return false;
    }

    if (!form.roomId) {
      setError('Vui lòng chọn phòng');
      return false;
    }

    if (!form.checkInDate) {
      setError('Vui lòng chọn ngày check-in');
      return false;
    }

    if (!form.checkOutDate) {
      setError('Vui lòng chọn ngày check-out');
      return false;
    }

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);

    if (checkOut <= checkIn) {
      setError('Ngày check-out phải sau ngày check-in');
      return false;
    }

    if (form.numberOfGuests < 1) {
      setError('Số lượng khách phải ít nhất 1 người');
      return false;
    }

    if (selectedRoom && form.numberOfGuests > selectedRoom.capacity) {
      setError(`Số lượng khách vượt quá sức chứa của phòng (${selectedRoom.capacity} người)`);
      return false;
    }

    return true;
  };

  const calculateDuration = () => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !form.checkInDate || !form.checkOutDate) return 0;
    const duration = calculateDuration();
    return selectedRoom.price * duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
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
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật booking');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  if (!open) return null;

  return (
    <Modal show={open} onHide={onClose} centered size="lg" className={styles['update-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCalendarAlt className="me-2" />
          Cập nhật booking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUser className="me-2" />
                  Khách hàng *
                </Form.Label>
                <Form.Select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaBed className="me-2" />
                  Phòng *
                </Form.Label>
                <Form.Select
                  name="roomId"
                  value={form.roomId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.roomNumber} ({r.type}) - {formatPrice(r.price)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Ngày check-in *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={form.checkInDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Ngày check-out *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={form.checkInDate}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCheckCircle className="me-2" />
                  Trạng thái booking
                </Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCreditCard className="me-2" />
                  Trạng thái thanh toán
                </Form.Label>
                <Form.Select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {paymentOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số lượng khách</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfGuests"
                  value={form.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  max={selectedRoom?.capacity || 10}
                  disabled={loading}
                />
                {selectedRoom && (
                  <Form.Text className="text-muted">
                    Sức chứa phòng: {selectedRoom.capacity} người
                  </Form.Text>
                )}
              </Form.Group>

              {form.checkInDate && form.checkOutDate && selectedRoom && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <FaMoneyBillWave className="me-2" />
                    Thông tin giá
                  </h6>
                  <div className="d-flex justify-content-between mb-1">
                    <small>Giá phòng/đêm:</small>
                    <small>{formatPrice(selectedRoom.price)}</small>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <small>Số đêm:</small>
                    <small>{calculateDuration()} đêm</small>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Tổng tiền:</strong>
                    <strong>{formatPrice(calculateTotalPrice())}</strong>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Yêu cầu đặc biệt</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="specialRequests"
              value={form.specialRequests}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập yêu cầu đặc biệt (nếu có)"
            />
          </Form.Group>

          <Alert variant="info">
            <strong>💡 Lưu ý:</strong>
            <ul className="mb-0 mt-2">
              <li>Thay đổi trạng thái sẽ gửi thông báo cho khách hàng</li>
              <li>Thay đổi ngày check-in/out có thể ảnh hưởng đến giá</li>
              <li>Booking đã hoàn thành không thể chỉnh sửa</li>
            </ul>
          </Alert>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBookingModal; 