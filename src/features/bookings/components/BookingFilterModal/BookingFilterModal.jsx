import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { getCustomers } from '../../../customers/CustomerAPI';
import { queryRooms } from '../../../rooms/RoomAPI';
import { FaTimes, FaFilter, FaCalendarAlt, FaMoneyBillWave, FaUser, FaHotel } from 'react-icons/fa';
import styles from './BookingFilterModal.module.scss';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';

const paymentOptions = [
  { value: '', label: '--Chọn trạng thái thanh toán--' },
  { value: 'Paid', label: 'Đã thanh toán' },
  { value: 'Unpaid', label: 'Chưa thanh toán' },
  { value: 'Partial', label: 'Thanh toán một phần' }
];

const statusOptions = [
  { value: '', label: '--Chọn trạng thái--' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Completed', label: 'Hoàn thành' }
];

const priceRangeOptions = [
  { value: '', label: '--Chọn khoảng giá--' },
  { value: '0-500000', label: 'Dưới 500,000 VNĐ' },
  { value: '500000-1000000', label: '500,000 - 1,000,000 VNĐ' },
  { value: '1000000-2000000', label: '1,000,000 - 2,000,000 VNĐ' },
  { value: '2000000+', label: 'Trên 2,000,000 VNĐ' }
];

const BookingFilterModal = ({ show, onHide, filter, setFilter }) => {
  const [localFilter, setLocalFilter] = useState(filter || {});
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (show) {
      (async () => {
        try {
          const [customerList, roomList] = await Promise.all([
            getCustomers(),
            queryRooms()
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
    onHide();
  };

  const handleClear = () => {
    setLocalFilter({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilter).filter(value => value !== '' && value !== undefined).length;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>
          <div className={styles.titleContent}>
            <FaFilter className={styles.filterIcon} />
            <span>🔍 Bộ lọc đặt phòng</span>
            {getActiveFiltersCount() > 0 && (
              <Badge bg="primary" className="ms-2">
                {getActiveFiltersCount()} bộ lọc
              </Badge>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className={styles.labelIcon} />
                Khách hàng
              </Form.Label>
              <Form.Select 
                name="customerId" 
                value={localFilter.customerId || ''} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">--Chọn khách hàng--</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.fullName} ({c.email})</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaHotel className={styles.labelIcon} />
                Phòng
              </Form.Label>
              <Form.Select 
                name="roomId" 
                value={localFilter.roomId || ''} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">--Chọn phòng--</option>
                {rooms.map(r => (
                  <option key={r._id} value={r._id}>{r.roomNumber} ({r.type})</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCalendarAlt className={styles.labelIcon} />
                Ngày check-in
              </Form.Label>
              <Form.Control 
                type="date" 
                name="checkInDate" 
                value={localFilter.checkInDate || ''} 
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCalendarAlt className={styles.labelIcon} />
                Ngày check-out
              </Form.Label>
              <Form.Control 
                type="date" 
                name="checkOutDate" 
                value={localFilter.checkOutDate || ''} 
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái booking</Form.Label>
              <Form.Select 
                name="status" 
                value={localFilter.status || ''} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaMoneyBillWave className={styles.labelIcon} />
                Trạng thái thanh toán
              </Form.Label>
              <Form.Select 
                name="paymentStatus" 
                value={localFilter.paymentStatus || ''} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                {paymentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Khoảng giá</Form.Label>
              <Form.Select 
                name="priceRange" 
                value={localFilter.priceRange || ''} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                {priceRangeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sắp xếp theo</Form.Label>
              <Form.Select 
                name="sortBy" 
                value={localFilter.sortBy || 'createdAt'} 
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="createdAt">Ngày tạo (mới nhất)</option>
                <option value="createdAt_asc">Ngày tạo (cũ nhất)</option>
                <option value="checkInDate">Ngày check-in</option>
                <option value="totalPrice">Giá (thấp-cao)</option>
                <option value="totalPrice_desc">Giá (cao-thấp)</option>
                <option value="status">Trạng thái</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Khoảng thời gian tùy chỉnh</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="date"
                    placeholder="Từ ngày"
                    name="startDate"
                    value={localFilter.startDate || ''}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="date"
                    placeholder="Đến ngày"
                    name="endDate"
                    value={localFilter.endDate || ''}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="outline-secondary" onClick={handleClear}>
          🔄 Xóa lọc
        </Button>
        <Button variant="outline-primary" onClick={onHide}>
          ❌ Hủy
        </Button>
        <Button variant="primary" onClick={handleApply}>
          ✅ Áp dụng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingFilterModal; 