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
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [disapproveReason, setDisapproveReason] = useState('');
  
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
    fetchRequests();
    fetchCustomers();
  }, [token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getBookingChangeRequests(token, {
        status: filter.status,
        type: filter.type,
        customerId: filter.customerId,
        dateRange: filter.dateRange
      });
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
    setFilter(filterValues);
    setCurrentPage(1);
    fetchRequests();
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
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Có lỗi xảy ra khi phê duyệt yêu cầu');
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
    } catch (err) {
      console.error('Error disapproving request:', err);
      alert('Có lỗi xảy ra khi từ chối yêu cầu');
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
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

  // Filter and paginate requests
  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = request.user?.fullName || '';
    const customerEmail = request.user?.email || '';
    const bookingId = request.bookingId?._id || '';
    
    return customerName.toLowerCase().includes(searchLower) ||
           customerEmail.toLowerCase().includes(searchLower) ||
           bookingId.toLowerCase().includes(searchLower);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const exportColumns = [
    { key: 'customerName', header: 'Khách hàng', accessor: 'user.fullName' },
    { key: 'customerEmail', header: 'Email', accessor: 'user.email' },
    { key: 'type', header: 'Loại yêu cầu', accessor: 'type' },
    { key: 'status', header: 'Trạng thái', accessor: 'status' },
    { key: 'roomNumber', header: 'Phòng', accessor: 'room.roomNumber' },
    { key: 'checkInDate', header: 'Ngày check-in', accessor: 'bookingId.checkInDate' },
    { key: 'checkOutDate', header: 'Ngày check-out', accessor: 'bookingId.checkOutDate' },
    { key: 'createdAt', header: 'Ngày tạo', accessor: 'createdAt' }
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
    } else if (format === 'excel') {
      exportToExcel(exportConfig);
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
      alert('Không thể xuất file Excel. Vui lòng thử xuất CSV!');
    }
  };

  if (loading) return <LoadingSpinner overlay text="Đang tải danh sách yêu cầu..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className={styles.requestPageContainer}>
      {/* Header */}
      <div className={styles.requestHeader}>
        <div>
          <h2 className={styles.requestTitle}>Quản lý yêu cầu thay đổi</h2>
          <p className={styles.requestSubtitle}>Xử lý các yêu cầu thay đổi và hủy đặt phòng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className={styles.statsRow}>
        <Col md={2} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Tổng yêu cầu"
            value={stats.total}
            icon={<FaBell />}
            color="#00AEEF"
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

      {/* Request List with Toolbar */}
      <Card className={styles.requestListCard}>
        <Card.Header className={styles.cardHeader}>
          <div className={styles.toolbarContainer}>
            <div className={styles.searchSection}>
              <SearchBox
                placeholder="Tìm kiếm theo tên khách hàng, email, mã booking..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                debounceMs={500}
              />
            </div>
            <div className={styles.actionButtons}>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={fetchRequests}
                className={styles.toolbarBtn}
              >
                <FaRedo />
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setShowExport(true)}
                className={styles.toolbarBtn}
              >
                <FaDownload />
              </Button>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={() => setShowFilter(true)}
                className={styles.toolbarBtn}
              >
                <FaFilter />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className={styles.cardBody}>
          {/* Active Filters Display */}
          {Object.values(filter).some(value => value !== '') && (
            <div className={styles.activeFiltersDisplay}>
              <div className={styles.filterLabel}>
                <FaFilter size={14} />
                Bộ lọc đang áp dụng:
              </div>
              <div className={styles.filterTags}>
                {filter.status && (
                  <span className={styles.filterTag}>
                    Trạng thái: {filter.status === 'Pending' ? 'Chờ xử lý' : 
                                 filter.status === 'Approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                    <button 
                      onClick={() => handleFilter({...filter, status: ''})}
                      className={styles.removeFilter}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filter.type && (
                  <span className={styles.filterTag}>
                    Loại: {filter.type === 'Update' ? 'Thay đổi' : 'Hủy'}
                    <button 
                      onClick={() => handleFilter({...filter, type: ''})}
                      className={styles.removeFilter}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filter.customerId && (
                  <span className={styles.filterTag}>
                    Khách hàng: {customers.find(c => c._id === filter.customerId)?.fullName || 'N/A'}
                    <button 
                      onClick={() => handleFilter({...filter, customerId: ''})}
                      className={styles.removeFilter}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filter.dateRange && (
                  <span className={styles.filterTag}>
                    Thời gian: {filter.dateRange === 'today' ? 'Hôm nay' :
                                filter.dateRange === 'week' ? 'Tuần này' :
                                filter.dateRange === 'month' ? 'Tháng này' :
                                filter.dateRange === 'quarter' ? 'Quý này' : 'Năm nay'}
                    <button 
                      onClick={() => handleFilter({...filter, dateRange: ''})}
                      className={styles.removeFilter}
                    >
                      ×
                    </button>
                  </span>
                )}
                <button 
                  onClick={() => handleFilter({status: '', type: '', customerId: '', dateRange: ''})}
                  className={styles.clearAllFilters}
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}
          {/* Table */}
          <div className={styles.tableContainer}>
            <Table responsive hover className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>STT</th>
                  <th>Khách hàng</th>
                  <th>Loại yêu cầu</th>
                  <th>Thông tin booking</th>
                  <th>Thay đổi yêu cầu</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request, idx) => (
                  <tr key={request._id} className={styles.tableRow}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>
                          {request.user?.fullName || 'N/A'}
                        </div>
                        <div className={styles.customerEmail}>
                          {request.user?.email || 'N/A'}
                        </div>
                        <div className={styles.customerPhone}>
                          {request.user?.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>{getTypeBadge(request.type)}</td>
                    <td>
                      <div className={styles.bookingInfo}>
                        <div className={styles.roomNumber}>
                          Phòng: {request.room?.roomNumber || 'N/A'}
                        </div>
                        <div className={styles.dates}>
                          {formatDate(request.bookingId?.checkInDate)} - {formatDate(request.bookingId?.checkOutDate)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.changesInfo}>
                        {request.type === 'Update' ? (
                          <>
                            <div>Phòng mới: {request.requestedRoomId?.roomNumber || 'N/A'}</div>
                            <div>Ngày mới: {formatDate(request.requestedCheckInDate)} - {formatDate(request.requestedCheckOutDate)}</div>
                          </>
                        ) : (
                          <div>Lý do: {request.cancellationReason || 'N/A'}</div>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className={styles.dateInfo}>
                        <FaCalendar className={styles.dateIcon} />
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={() => handleViewDetail(request)}
                        className={styles.actionBtn}
                      >
                        <FaEye />
                      </Button>
                      {request.status === 'Pending' && (
                        <>
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => handleApprove(request._id)}
                            className={styles.actionBtn}
                          >
                            <FaCheck />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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

          {/* Empty state */}
          {filteredRequests.length === 0 && (
            <div className={styles.emptyState}>
              <FaBell size={48} className="text-muted mb-3" />
              <h4>Không có yêu cầu nào</h4>
              <p>
                {searchTerm 
                  ? `Không có yêu cầu nào phù hợp với "${searchTerm}"`
                  : 'Chưa có yêu cầu thay đổi nào trong hệ thống'
                }
              </p>
            </div>
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