import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getCustomers } from '../../../customers/CustomerAPI';
import { getRooms } from '../../../rooms/RoomAPI';
import { FaTimes } from 'react-icons/fa';
import styles from './BookingFilterModal.module.scss';
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

const BookingFilterModal = ({ show, onClose, filter, setFilter }) => {
  const [localFilter, setLocalFilter] = useState(filter || {});
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (show) {
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
      setLocalFilter(filter || {});
    }
  }, [show, filter]);

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setFilter(localFilter);
    onClose();
  };

  const handleClear = () => {
    setLocalFilter({});
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Bộ lọc booking</Modal.Title>
        <CloseModalButton onClick={onClose} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Khách hàng</Form.Label>
            <Form.Select name="customerId" value={localFilter.customerId || ''} onChange={handleChange}>
              <option value="">--Chọn khách hàng--</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.fullName} ({c.email})</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phòng</Form.Label>
            <Form.Select name="roomId" value={localFilter.roomId || ''} onChange={handleChange}>
              <option value="">--Chọn phòng--</option>
              {rooms.map(r => (
                <option key={r._id} value={r._id}>{r.roomNumber} ({r.type})</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày nhận</Form.Label>
            <Form.Control type="date" name="checkInDate" value={localFilter.checkInDate || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày trả</Form.Label>
            <Form.Control type="date" name="checkOutDate" value={localFilter.checkOutDate || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select name="status" value={localFilter.status || ''} onChange={handleChange}>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thanh toán</Form.Label>
            <Form.Select name="paymentStatus" value={localFilter.paymentStatus || ''} onChange={handleChange}>
              {paymentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
        <Button variant="outline-danger" onClick={handleClear}>Xóa lọc</Button>
        <Button variant="primary" onClick={handleApply}>Áp dụng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingFilterModal; 