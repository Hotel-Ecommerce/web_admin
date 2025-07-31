import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
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
        setError('Không thể tải dữ liệu');
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
    setError('');
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onAdd(formData);
      handleClose();
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
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>Tạo booking mới</Modal.Title>
        <CloseModalButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Khách hàng *</Form.Label>
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
            <Form.Label>Phòng *</Form.Label>
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
                  {room.roomNumber} - {room.roomType} - {room.price?.toLocaleString()} VNĐ
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Ngày check-in *</Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Ngày check-out *</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Số lượng khách *</Form.Label>
            <Form.Control
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              min="1"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Yêu cầu đặc biệt</Form.Label>
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

          {error && <Alert variant="danger">{error}</Alert>}

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