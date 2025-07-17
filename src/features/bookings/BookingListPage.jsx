import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import BookingAPI from './BookingAPI';
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal';
import DeleteBookingModal from './components/DeleteBookingModal/DeleteBookingModal';
import AddBookingModal from './components/AddBookingModal/AddBookingModal';
import UpdateBookingModal from './components/UpdateBookingModal/UpdateBookingModal';
import BookingFilterBar from './components/BookingFilterBar/BookingFilterBar';
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
  const [filteredBookings, setFilteredBookings] = useState([]);

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

  // Lọc dữ liệu khi bấm "Tìm kiếm"
  const handleFilter = () => {
    let filtered = bookings.filter(b => {
      const matchCustomer = filters.customerId === '' || (b.customerId && b.customerId.toLowerCase().includes(filters.customerId.toLowerCase()));
      const matchRoom = filters.roomId === '' || (b.roomId && b.roomId.toString().includes(filters.roomId));
      const matchCheckIn = (!filters.checkInDate || new Date(b.checkInDate) >= new Date(filters.checkInDate)) &&
                           (!filters.checkOutDate || new Date(b.checkOutDate) <= new Date(filters.checkOutDate));
      const matchPayment = filters.paymentStatus === '' || b.paymentStatus === filters.paymentStatus;
      return matchCustomer && matchRoom && matchCheckIn && matchPayment;
    });
    setFilteredBookings(filtered);
  };

  // Reset filter
  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      customerId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      paymentStatus: ''
    });
    setFilteredBookings(bookings);
  };

  // Khi bookings thay đổi, reset filteredBookings
  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

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
          <Button style={{background:'#00AEEF', border:'none', color:'#fff'}} size="sm" className="me-2" onClick={() => handleViewDetail(row)}>👁️ Xem</Button>
          <Button style={{background:'#ffc107', border:'none', color:'#1C1C1E'}} size="sm" className="me-2" onClick={() => handleEdit(row)}>✏️ Sửa</Button>
          <Button style={{background:'#dc3545', border:'none', color:'#fff'}} size="sm" onClick={() => handleDelete(row)}>🗑️ Xóa</Button>
        </>
      )
    }
  ];

  return (
    <Container className={styles.bookingPageContainer}>
      <BookingFilterBar
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilter}
        onReset={handleReset}
      />
      <div className={styles.bookingHeader}>
        <h2 className={styles.bookingTitle}>Danh sách đặt phòng</h2>
        <Button variant="success" className={styles.addBookingBtn} onClick={() => setShowAddModal(true)}>
          + Thêm đặt phòng
        </Button>
      </div>

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
        <TableWrapper columns={columns} data={filteredBookings} loading={loading} />
      )}

      {/* Pagination */}
      {!loading && bookings.length > 0 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-between align-items-center">
            <div style={{color:'#6C757D'}}>
              Trang {filters.page + 1} - Hiển thị {filteredBookings.length} kết quả
            </div>
            <div>
              <Button
                style={{background:'#fff', color:'#1C1C1E', border:'1px solid #e9ecef', borderRadius: 6}}
                disabled={filters.page === 0}
                onClick={() => handlePageChange(filters.page - 1)}
                className="me-2"
              >
                Trước
              </Button>
              <Button
                style={{background:'#fff', color:'#1C1C1E', border:'1px solid #e9ecef', borderRadius: 6}}
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