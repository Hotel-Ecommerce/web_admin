import React from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './BookingFilterBar.module.scss';

const BookingFilterBar = ({ filters, setFilters, onFilter, onReset }) => {
  return (
    <form className={styles.filterBar} onSubmit={e => { e.preventDefault(); onFilter(); }}>
      <div className={styles.filterField}>
        <Form.Control
          placeholder="Tên khách hàng"
          value={filters.customerName}
          onChange={e => setFilters(f => ({ ...f, customerName: e.target.value }))}
        />
      </div>
      <div className={styles.filterField}>
        <Form.Control
          placeholder="Số phòng"
          value={filters.roomNumber}
          onChange={e => setFilters(f => ({ ...f, roomNumber: e.target.value }))}
        />
      </div>
      <div className={styles.filterField}>
        <Form.Label>Nhận phòng từ</Form.Label>
        <Form.Control
          type="date"
          value={filters.checkInDateFrom}
          onChange={e => setFilters(f => ({ ...f, checkInDateFrom: e.target.value }))}
        />
      </div>
      <div className={styles.filterField}>
        <Form.Label>Nhận phòng đến</Form.Label>
        <Form.Control
          type="date"
          value={filters.checkInDateTo}
          onChange={e => setFilters(f => ({ ...f, checkInDateTo: e.target.value }))}
        />
      </div>
      <div className={styles.filterField}>
        <Form.Select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="pending">Đang chờ</option>
          <option value="cancelled">Đã hủy</option>
          <option value="checked-in">Đã nhận phòng</option>
          <option value="checked-out">Đã trả phòng</option>
        </Form.Select>
      </div>
      <div className={styles.filterField}>
        <Form.Select
          value={filters.paymentStatus}
          onChange={e => setFilters(f => ({ ...f, paymentStatus: e.target.value }))}
        >
          <option value="">Tất cả thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="pending">Đang xử lý</option>
        </Form.Select>
      </div>
      <Button className={styles.filterButton} type="submit">Tìm kiếm</Button>
      <Button className={styles.filterButton} variant="secondary" type="button" onClick={onReset}>Xóa bộ lọc</Button>
    </form>
  );
};

export default BookingFilterBar; 