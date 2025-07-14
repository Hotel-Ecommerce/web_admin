import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import BookingAPI from './BookingAPI';
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal';
import DeleteBookingModal from './components/DeleteBookingModal/DeleteBookingModal';
import AddBookingModal from './components/AddBookingModal/AddBookingModal';
import UpdateBookingModal from './components/UpdateBookingModal/UpdateBookingModal';
import styles from './BookingListPage.module.scss';

const BookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    paymentStatus: ''
  });

  // Load bookings
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await BookingAPI.getBookingList(filters);
      setBookings(data);
    } catch (err) {
      setError('Không thể tải danh sách đặt phòng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 0 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle booking operations
  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowUpdateModal(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (bookingId) => {
    try {
      await BookingAPI.deleteBooking(bookingId);
      setShowDeleteModal(false);
      setSelectedBooking(null);
      loadBookings(); // Reload the list
    } catch (err) {
      setError('Không thể xóa đặt phòng: ' + err.message);
    }
  };

  const handleAddBooking = async (bookingData) => {
    try {
      await BookingAPI.addBooking(bookingData);
      setShowAddModal(false);
      loadBookings(); // Reload the list
    } catch (err) {
      setError('Không thể thêm đặt phòng: ' + err.message);
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      await BookingAPI.updateBooking(bookingData);
      setShowUpdateModal(false);
      setSelectedBooking(null);
      loadBookings(); // Reload the list
    } catch (err) {
      setError('Không thể cập nhật đặt phòng: ' + err.message);
    }
  };

  // Table columns configuration
  const columns = [
    { header: 'Khách hàng', accessor: 'customerName' },
    { header: 'Phòng', accessor: 'roomNumber' },
    { header: 'Ngày nhận', accessor: 'checkInDate' },
    { header: 'Ngày trả', accessor: 'checkOutDate' },
    { header: 'Trạng thái thanh toán', accessor: 'paymentStatus' },
    { header: 'Tổng tiền', accessor: 'totalPrice' },
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <>
          <Button 
            variant="outline-info" 
            size="sm" 
            onClick={() => handleViewDetail(row)} 
            className="me-2"
          >
            👁️ Xem
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={() => handleEdit(row)} 
            className="me-2"
          >
            ✏️ Sửa
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={() => handleDelete(row)}
          >
            🗑️ Xóa
          </Button>
        </>
      )
    }
  ];

  return (
    <Container className={styles.bookingPageContainer}>
      <div className={styles.bookingHeader}>
        <h2 className={styles.bookingTitle}>Danh sách đặt phòng</h2>
        <Button variant="success" className={styles.addBookingBtn} onClick={() => setShowAddModal(true)}>
          + Thêm đặt phòng
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={12}>
          <Form className="bg-light p-3 rounded">
            <Row>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>ID Khách hàng</Form.Label>
                  <Form.Control
                    type="text"
                    value={filters.customerId}
                    onChange={(e) => handleFilterChange('customerId', e.target.value)}
                    placeholder="Nhập ID khách hàng"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>ID Phòng</Form.Label>
                  <Form.Control
                    type="text"
                    value={filters.roomId}
                    onChange={(e) => handleFilterChange('roomId', e.target.value)}
                    placeholder="Nhập ID phòng"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.checkInDate}
                    onChange={(e) => handleFilterChange('checkInDate', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.checkOutDate}
                    onChange={(e) => handleFilterChange('checkOutDate', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Trạng thái thanh toán</Form.Label>
                  <Form.Select
                    value={filters.paymentStatus}
                    onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="PAID">Đã thanh toán</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setFilters({
                    page: 0,
                    size: 20,
                    customerId: '',
                    roomId: '',
                    checkInDate: '',
                    checkOutDate: '',
                    paymentStatus: ''
                  })}
                >
                  Xóa bộ lọc
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      )}

      {/* Bookings Table */}
      {!loading && (
        <TableWrapper columns={columns} data={bookings} loading={loading} />
      )}

      {/* Pagination */}
      {!loading && bookings.length > 0 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-between align-items-center">
            <div>
              Trang {filters.page + 1} - Hiển thị {bookings.length} kết quả
            </div>
            <div>
              <Button
                variant="outline-primary"
                disabled={filters.page === 0}
                onClick={() => handlePageChange(filters.page - 1)}
                className="me-2"
              >
                Trước
              </Button>
              <Button
                variant="outline-primary"
                disabled={bookings.length < filters.size}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Sau
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Modals */}
      <BookingDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        booking={selectedBooking}
      />

      <DeleteBookingModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        booking={selectedBooking}
        onDelete={handleDeleteConfirm}
      />

      <AddBookingModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddBooking}
      />

      <UpdateBookingModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        booking={selectedBooking}
        onUpdate={handleUpdateBooking}
      />
    </Container>
  );
};

export default BookingListPage; 