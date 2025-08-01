import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaUser, FaBed, FaCalendarAlt, FaUsers, FaComment, FaMoneyBillWave } from 'react-icons/fa';
import { addBooking } from '../../BookingAPI';
import { queryRooms } from '../../../rooms/RoomAPI';
import { getCustomers } from '../../../customers/CustomerAPI';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';
import styles from './AddBookingModal.module.scss';

const AddBookingModal = ({ show, onHide, onAdd }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, customersData] = await Promise.all([
          queryRooms(),
          getCustomers()
        ]);
        setRooms(roomsData);
        setCustomers(customersData);
      } catch (err) {
        setError('Không thể tải dữ liệu phòng và khách hàng');
      }
    };
    if (show) {
      fetchData();
    }
  }, [show]);

  const handleClose = () => {
    setFormData({
      customerId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: ''
    });
    setSelectedRoom(null);
    setError('');
    setSuccess('');
    onHide();
  };

  const validateForm = () => {
    if (!formData.customerId) {
      setError('Vui lòng chọn khách hàng');
      return false;
    }

    if (!formData.roomId) {
      setError('Vui lòng chọn phòng');
      return false;
    }

    if (!formData.checkInDate) {
      setError('Vui lòng chọn ngày check-in');
      return false;
    }

    if (!formData.checkOutDate) {
      setError('Vui lòng chọn ngày check-out');
      return false;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError('Ngày check-in không thể là ngày trong quá khứ');
      return false;
    }

    if (checkOut <= checkIn) {
      setError('Ngày check-out phải sau ngày check-in');
      return false;
    }

    if (formData.numberOfGuests < 1) {
      setError('Số lượng khách phải ít nhất 1 người');
      return false;
    }

    if (selectedRoom && formData.numberOfGuests > selectedRoom.capacity) {
      setError(`Số lượng khách vượt quá sức chứa của phòng (${selectedRoom.capacity} người)`);
      return false;
    }

    return true;
  };

  const calculateDuration = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0;
    const duration = calculateDuration();
    return selectedRoom.price * duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await onAdd(formData);
      setSuccess('Tạo booking thành công!');
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Update selected room when room changes
    if (name === 'roomId') {
      const room = rooms.find(r => r._id === value);
      setSelectedRoom(room);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className={styles['add-booking-modal']}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCalendarAlt className="me-2" />
          Tạo booking mới
        </Modal.Title>
        <CloseModalButton onClick={handleClose} />
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
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.fullName} - {customer.phone}
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
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} - {room.type} - {formatPrice(room.price)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUsers className="me-2" />
                  Số lượng khách *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  max={selectedRoom?.capacity || 10}
                  required
                  disabled={loading}
                />
                {selectedRoom && (
                  <Form.Text className="text-muted">
                    Sức chứa phòng: {selectedRoom.capacity} người
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Ngày check-in *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
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
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                />
              </Form.Group>

              {formData.checkInDate && formData.checkOutDate && selectedRoom && (
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
            <Form.Label>
              <FaComment className="me-2" />
              Yêu cầu đặc biệt
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập yêu cầu đặc biệt (nếu có)"
            />
          </Form.Group>

          <Alert variant="info">
            <strong>💡 Lưu ý:</strong>
            <ul className="mb-0 mt-2">
              <li>Booking sẽ được tạo với trạng thái "Chờ xác nhận"</li>
              <li>Khách hàng sẽ nhận được email thông báo</li>
              <li>Có thể cập nhật trạng thái sau khi tạo</li>
            </ul>
          </Alert>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang tạo...
                </>
              ) : (
                'Tạo booking'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBookingModal; 