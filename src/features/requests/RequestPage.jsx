import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, Badge, Table, Pagination, Modal, Form, Alert } from 'react-bootstrap';
import { UserContext } from '../../context/UserContext';
import { getBookingChangeRequests, approveBookingChangeRequest, disapproveBookingChangeRequest, getCustomersForFilter } from './RequestAPI';
import styles from './RequestPage.module.scss';
import { formatDate } from '../../utils/dateUtils';
import { 
  FaExchangeAlt, 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaFilter,
  FaDownload,
  FaBell,
  FaUser,
  FaCalendar,
  FaHotel,
  FaMoneyBillWave,
  FaRedo,
  FaSearch,
  FaBan,
  FaEdit
} from 'react-icons/fa';
import { 
  LoadingSpinner, 
  StatCard, 
  SearchBox,
  ExportDataModal 
} from '../../components';
import RequestFilterModal from './components/RequestFilterModal/RequestFilterModal';

const RequestPage = () => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    customerId: '',
    dateRange: ''
  });
  const [customers, setCustomers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [disapproveReason, setDisapproveReason] = useState('');
  
  // Notification states
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    disapproved: 0,
    updates: 0,
    cancellations: 0
  });

  useEffect(() => {
    if (token) {
      fetchCustomers();
      setIsInitialized(true);
    }
  }, [token]);

  // useEffect để load data lần đầu
  useEffect(() => {
    if (token && isInitialized && !hasInitialLoad) {
      console.log('🚀 Initial data load');
      fetchRequests();
      setHasInitialLoad(true);
    }
  }, [token, isInitialized, hasInitialLoad]);

  // useEffect để theo dõi thay đổi filter
  useEffect(() => {
    console.log('🔄 Filter changed:', { filter, token: !!token, isInitialized });
    if (token && isInitialized && hasInitialLoad) {
      fetchRequests();
    }
  }, [filter, token, isInitialized, hasInitialLoad]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching requests with filter:', filter);
      const data = await getBookingChangeRequests(token, {
        status: filter.status,
        type: filter.type,
        customerId: filter.customerId,
        dateRange: filter.dateRange
      });
      console.log('📊 Received data:', data.length, 'requests');
      setRequests(data);
      
      // Calculate stats
      const total = data.length;
      const pending = data.filter(req => req.status === 'Pending').length;
      const approved = data.filter(req => req.status === 'Approved').length;
      const disapproved = data.filter(req => req.status === 'Disapproved').length;
      const updates = data.filter(req => req.type === 'Update').length;
      const cancellations = data.filter(req => req.type === 'Cancel').length;
      
      setStats({
        total,
        pending,
        approved,
        disapproved,
        updates,
        cancellations
      });
    } catch (err) {
      setError('Lỗi khi tải danh sách yêu cầu');
      console.error('Error fetching requests:', err);
      showNotification('danger', '❌ Có lỗi xảy ra khi tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomersForFilter(token);
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilter = (filterValues) => {
    console.log('🔍 Filter changed:', filterValues);
    setFilter(filterValues);
    setCurrentPage(1);
    
    // Thông báo khi áp dụng filter
    const hasFilters = Object.values(filterValues).some(value => value !== '');
    if (hasFilters) {
      showNotification('info', '🔍 Đã áp dụng bộ lọc!');
    }
    
    // fetchRequests() sẽ được gọi tự động bởi useEffect khi filter thay đổi
  };

  const handleRefresh = async () => {
    try {
      await fetchRequests();
      showNotification('info', '🔄 Đã làm mới dữ liệu thành công!');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });
    
    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
      setNotification({
        show: false,
        type: '',
        message: ''
      });
    }, 5000);
  };

  const handleApprove = async (requestId) => {
    try {
      await approveBookingChangeRequest(requestId, token);
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: 'Approved', approvedBy: user._id, approvedAt: new Date() }
          : req
      ));
      fetchRequests(); // Refresh to update stats
      showNotification('success', '✅ Phê duyệt yêu cầu thành công!');
    } catch (err) {
      console.error('Error approving request:', err);
      showNotification('danger', '❌ Có lỗi xảy ra khi phê duyệt yêu cầu');
    }
  };

  const handleDisapprove = async (requestId, reason) => {
    try {
      await disapproveBookingChangeRequest(requestId, reason, token);
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: 'Disapproved', approvedBy: user._id, approvedAt: new Date(), reasonForDisapproval: reason }
          : req
      ));
      setShowDisapproveModal(false);
      setDisapproveReason('');
      fetchRequests(); // Refresh to update stats
      showNotification('warning', '⚠️ Đã từ chối yêu cầu thành công!');
    } catch (err) {
      console.error('Error disapproving request:', err);
      showNotification('danger', '❌ Có lỗi xảy ra khi từ chối yêu cầu');
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
    showNotification('info', '👁️ Đang xem chi tiết yêu cầu...');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning"><FaClock /> Chờ xử lý</Badge>;
      case 'Approved':
        return <Badge bg="success"><FaCheck /> Đã phê duyệt</Badge>;
      case 'Disapproved':
        return <Badge bg="danger"><FaTimes /> Đã từ chối</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Update':
        return <Badge bg="info"><FaEdit /> Thay đổi</Badge>;
      case 'Cancel':
        return <Badge bg="warning"><FaBan /> Hủy</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  // Filter requests based on search and filter
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bookingId?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filter.status || request.status === filter.status;
    const matchesType = !filter.type || request.type === filter.type;
    const matchesCustomer = !filter.customerId || request.user?._id === filter.customerId;
    
    return matchesSearch && matchesStatus && matchesType && matchesCustomer;
  });

  // Export columns configuration
  const exportColumns = [
    { key: 'customerName', label: 'Khách hàng' },
    { key: 'type', label: 'Loại yêu cầu' },
    { key: 'bookingId', label: 'Mã booking' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'createdAt', label: 'Ngày tạo' }
  ];

  const handleCustomExport = (exportConfig) => {
    const { data, columns, format } = exportConfig;
    
    const exportData = data.map(request => {
      const transformed = {};
      columns.forEach(colKey => {
        let value = request[colKey];
        
        if (colKey === 'createdAt') {
          value = formatDate(value);
        } else if (colKey === 'type') {
          value = value === 'Update' ? 'Thay đổi' : 'Hủy';
        } else if (colKey === 'status') {
          value = value === 'Pending' ? 'Chờ xử lý' : 
                 value === 'Approved' ? 'Đã phê duyệt' : 'Đã từ chối';
        }
        
        transformed[colKey] = value || '';
      });
      return transformed;
    });
    
    exportConfig.data = exportData;
    
    if (format === 'csv') {
      exportToCSV(exportConfig);
      showNotification('success', '📄 Đã xuất dữ liệu thành file CSV!');
    } else if (format === 'excel') {
      exportToExcel(exportConfig);
      showNotification('success', '📊 Đã xuất dữ liệu thành file Excel!');
    }
  };

  const exportToCSV = (exportConfig) => {
    const { data, columns, fileName } = exportConfig;
    const headers = columns.map(col => col);
    const csvContent = [
      headers,
      ...data.map(row => columns.map(col => row[col] || ''))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = async (exportConfig) => {
    try {
      const XLSX = await import('xlsx');
      const { saveAs } = await import('file-saver');
      const { data, columns, fileName } = exportConfig;

      const exportData = data.map(row => {
        const obj = {};
        columns.forEach(col => {
          obj[col] = row[col] || '';
        });
        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Requests');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      showNotification('warning', '⚠️ Không thể xuất file Excel. Vui lòng thử xuất CSV!');
    }
  };

  if (loading) return <LoadingSpinner overlay text="Đang tải danh sách yêu cầu..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className={styles.requestPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Quản lý yêu cầu thay đổi</h1>
        <p className={styles.subtitle}>
          Xem xét và xử lý các yêu cầu thay đổi booking từ khách hàng
        </p>
      </div>

      {/* Notification Alert */}
      {notification.show && (
        <Alert 
          variant={notification.type} 
          dismissible 
          onClose={() => setNotification({ show: false, type: '', message: '' })}
          className="mb-3"
        >
          {notification.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className={styles.statsContainer}>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Tổng cộng"
            value={stats.total}
            icon={<FaExchangeAlt />}
            color="#007bff"
          />
        </Col>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Chờ xử lý"
            value={stats.pending}
            icon={<FaClock />}
            color="#ffc107"
          />
        </Col>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Đã phê duyệt"
            value={stats.approved}
            icon={<FaCheck />}
            color="#28a745"
          />
        </Col>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Đã từ chối"
            value={stats.disapproved}
            icon={<FaTimes />}
            color="#dc3545"
          />
        </Col>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Yêu cầu thay đổi"
            value={stats.updates}
            icon={<FaEdit />}
            color="#17a2b8"
          />
        </Col>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Yêu cầu hủy"
            value={stats.cancellations}
            icon={<FaBan />}
            color="#fd7e14"
          />
        </Col>
      </Row>

      {/* Controls */}
      <div className={styles.controlsContainer}>
        <Row>
          <Col md={8}>
            <SearchBox
              placeholder="Tìm kiếm theo tên khách hàng, email, mã booking..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              debounceMs={500}
            />
          </Col>
          <Col md={4}>
            <div className={styles.actionButtons}>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleRefresh}
              >
                <FaRedo className="me-2" />
                Làm mới
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setShowExport(true)}
              >
                <FaDownload className="me-2" />
                Xuất dữ liệu
              </Button>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={() => setShowFilter(true)}
              >
                <FaFilter className="me-2" />
                Bộ lọc
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Requests Table */}
      <Card className={styles.tableCard}>
        <Card.Body className={styles.tableBody}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner text="Đang tải dữ liệu..." />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5">
              <div style={{
                width: '120px',
                height: '120px',
                background: '#f8f9fa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                color: '#6c757d'
              }}>
                📋
              </div>
              <h4 className="text-muted mb-3">Không có yêu cầu nào</h4>
              <p className="text-muted mb-4">
                {searchTerm || Object.values(filter).some(v => v !== '' && v !== 'all') 
                  ? 'Không tìm thấy yêu cầu nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có yêu cầu thay đổi booking nào trong hệ thống.'
                }
              </p>
              {!searchTerm && Object.values(filter).every(v => v === '' || v === 'all') && (
                <div className="d-flex justify-content-center gap-2">
                  <Button 
                    variant="primary" 
                    onClick={handleRefresh}
                  >
                    <FaRedo className="me-2" />
                    Làm mới
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.requestsTable}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Loại yêu cầu</th>
                      <th>Booking</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequests.map((request) => (
                      <tr key={request._id} className={styles.tableRow}>
                        <td>
                          <div className={styles.customerInfo}>
                            <div className={styles.customerName}>
                              {request.user?.fullName || 'N/A'}
                            </div>
                            <div className={styles.customerEmail}>
                              {request.user?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.typeInfo}>
                            {getTypeBadge(request.type)}
                          </div>
                        </td>
                        <td>
                          <div className={styles.bookingInfo}>
                            <div className={styles.bookingId}>
                              {request.bookingId?._id || 'N/A'}
                            </div>
                            <div className={styles.roomInfo}>
                              Phòng: {request.room?.roomNumber || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.dateInfo}>
                            {formatDate(request.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div className={styles.statusInfo}>
                            {getStatusBadge(request.status)}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleViewDetail(request)}
                              className={styles.actionBtn}
                            >
                              <FaEye />
                            </Button>
                            {request.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={() => handleApprove(request._id)}
                                  className={styles.actionBtn}
                                >
                                  <FaCheck />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowDisapproveModal(true);
                                  }}
                                  className={styles.actionBtn}
                                >
                                  <FaTimes />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination className={styles.pagination}>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, currentPage + 2);
                        return page >= start && page <= end;
                      })
                      .map(page => (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      ))}
                    
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết yêu cầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className={styles.detailContent}>
              <Row>
                <Col md={6}>
                  <h5>Thông tin khách hàng</h5>
                  <p><strong>Tên:</strong> {selectedRequest.user?.fullName}</p>
                  <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
                  <p><strong>SĐT:</strong> {selectedRequest.user?.phone}</p>
                </Col>
                <Col md={6}>
                  <h5>Thông tin booking</h5>
                  <p><strong>Mã booking:</strong> {selectedRequest.bookingId?._id}</p>
                  <p><strong>Phòng:</strong> {selectedRequest.room?.roomNumber}</p>
                  <p><strong>Ngày:</strong> {formatDate(selectedRequest.bookingId?.checkInDate)} - {formatDate(selectedRequest.bookingId?.checkOutDate)}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12}>
                  <h5>Chi tiết yêu cầu</h5>
                  <p><strong>Loại:</strong> {getTypeBadge(selectedRequest.type)}</p>
                  {selectedRequest.type === 'Update' ? (
                    <>
                      <p><strong>Phòng mới:</strong> {selectedRequest.requestedRoomId?.roomNumber}</p>
                      <p><strong>Ngày mới:</strong> {formatDate(selectedRequest.requestedCheckInDate)} - {formatDate(selectedRequest.requestedCheckOutDate)}</p>
                    </>
                  ) : (
                    <p><strong>Lý do hủy:</strong> {selectedRequest.cancellationReason}</p>
                  )}
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedRequest.status)}</p>
                  <p><strong>Ngày tạo:</strong> {formatDate(selectedRequest.createdAt)}</p>
                  {selectedRequest.approvedBy && (
                    <>
                      <p><strong>Người xử lý:</strong> {selectedRequest.approvedBy?.fullName}</p>
                      <p><strong>Ngày xử lý:</strong> {formatDate(selectedRequest.approvedAt)}</p>
                    </>
                  )}
                  {selectedRequest.reasonForDisapproval && (
                    <p><strong>Lý do từ chối:</strong> {selectedRequest.reasonForDisapproval}</p>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Disapprove Modal */}
      <Modal show={showDisapproveModal} onHide={() => setShowDisapproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Từ chối yêu cầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Lý do từ chối:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={disapproveReason}
                onChange={(e) => setDisapproveReason(e.target.value)}
                placeholder="Nhập lý do từ chối yêu cầu..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDisapproveModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDisapprove(selectedRequest?._id, disapproveReason)}
            disabled={!disapproveReason.trim()}
          >
            Từ chối
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Export Modal */}
      <ExportDataModal
        show={showExport}
        onHide={() => setShowExport(false)}
        data={filteredRequests}
        columns={exportColumns}
        defaultFileName="booking_change_requests"
        title="Xuất dữ liệu yêu cầu thay đổi"
        onExport={handleCustomExport}
      />

      {/* Filter Modal */}
      <RequestFilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilter}
        initialFilter={filter}
        customers={customers}
      />
    </Container>
  );
};

export default RequestPage; 