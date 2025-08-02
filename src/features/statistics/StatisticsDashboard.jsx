import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { UserContext } from '../../context/UserContext';
import { 
  getAllStatistics, 
  getRealTimeStatistics,
  exportStatistics,
  getAllMockData
} from './StatisticsAPI';
import styles from './StatisticsDashboard.module.scss';
import { getCurrentDate } from '../../utils/dateUtils';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaChartArea,
  FaDownload,
  FaFilter,
  FaCalendar,
  FaUsers,
  FaHotel,
  FaMoneyBillWave,
  FaPercent,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaRedo,
  FaCog,
  FaFileExcel,
  FaFileCsv,
  FaPrint,
  FaShare,
  FaBell,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { 
  LoadingSpinner, 
  StatCard, 
  SearchBox,
  ExportDataModal
} from '../../components';
import SummaryStatsModal from '../../components/SummaryStats/SummaryStatsModal';

const StatisticsDashboard = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [showExport, setShowExport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Statistics data
  const [stats, setStats] = useState({
    booking: {
      total: 0,
      confirmed: 0,
      cancelled: 0,
      confirmationRate: 0,
      cancellationRate: 0
    },
    revenue: {
      total: 0,
      paid: 0,
      unpaid: 0,
      averagePerBooking: 0
    },
    customer: {
      newCustomers: 0
    },
    room: {
      total: 0,
      totalCapacity: 0
    },
    requests: {
      pending: 0
    }
  });

  // Chart data
  const [bookingStats, setBookingStats] = useState([]);
  const [showCharts, setShowCharts] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    roomType: 'all',
    customerType: 'all',
    status: 'all'
  });

  // Real-time data
  const [realTimeData, setRealTimeData] = useState({
    todayBookings: 0,
    todayRevenue: 0,
    totalRooms: 0,
    pendingRequests: 0
  });

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user?.token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Set default date range if not provided
        const today = new Date();
        const defaultStart = new Date(today);
        defaultStart.setDate(today.getDate() - 30); // Default to last 30 days
        const startDate = filters.startDate || defaultStart.toISOString().slice(0, 10);
        const endDate = filters.endDate || today.toISOString().slice(0, 10);
        
        const apiParams = {
          ...filters,
          startDate,
          endDate,
          groupBy: 'day'
        };
        
        // Fetch all statistics using the new API
        const allStats = await getAllStatistics(user.token, apiParams);
        
        // Set booking stats for charts
        setBookingStats(allStats.bookingStats || []);
        
        // Set comprehensive stats
        if (allStats.comprehensiveStats) {
          setStats(allStats.comprehensiveStats);
        }
        
        // Fetch real-time data
        const realTime = await getRealTimeStatistics(user.token);
        setRealTimeData(realTime);
        
        setLastUpdated(new Date());

      } catch (error) {
        console.error('Error in statistics dashboard:', error);
        // Use mock data if API fails
        const mockData = getAllMockData();
        setStats(mockData.comprehensiveStats);
        setBookingStats(mockData.bookingStats);
        setRealTimeData(mockData.realTimeStats);
        setLastUpdated(new Date());
        setError('Đang sử dụng dữ liệu mẫu. Một số dữ liệu có thể không phản ánh tình trạng thực tế.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [user, dateRange, filters, refreshKey]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    // Update filters based on date range
    const today = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'quarter':
        startDate.setDate(today.getDate() - 90);
        break;
      case 'year':
        startDate.setDate(today.getDate() - 365);
        break;
      default:
        startDate = new Date();
    }
    
    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: today.toISOString().slice(0, 10)
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = async (format) => {
    if (!user?.token) return;
    
    try {
      await exportStatistics(user.token, format, { dateRange, ...filters });
      console.log('Export successful:', format);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Không thể xuất báo cáo. Vui lòng thử lại sau.');
    }
  };

  const getGrowthIcon = (rate) => {
    if (rate > 0) return <FaArrowUp className="text-success" />;
    if (rate < 0) return <FaArrowDown className="text-danger" />;
    return <FaPercent className="text-muted" />;
  };

  const getGrowthColor = (rate) => {
    if (rate > 0) return 'text-success';
    if (rate < 0) return 'text-danger';
    return 'text-muted';
  };

  const exportColumns = [
    { key: 'metric', header: 'Chỉ số', accessor: 'metric' },
    { key: 'value', header: 'Giá trị', accessor: 'value' },
    { key: 'change', header: 'Thay đổi', accessor: 'change' },
    { key: 'date', header: 'Ngày', accessor: 'date' }
  ];

  const exportData = [
    { metric: 'Tổng đặt phòng', value: stats.booking.total, change: '+12%', date: getCurrentDate() },
    { metric: 'Tổng doanh thu', value: `${stats.revenue.total.toLocaleString()} VNĐ`, change: '+8%', date: getCurrentDate() },
    { metric: 'Tỷ lệ xác nhận', value: `${stats.booking.confirmationRate}%`, change: '+2%', date: getCurrentDate() },
    { metric: 'Tỷ lệ hủy', value: `${stats.booking.cancellationRate}%`, change: '-3%', date: getCurrentDate() },
    { metric: 'Khách hàng mới', value: stats.customer.newCustomers, change: '+15%', date: getCurrentDate() },
    { metric: 'Yêu cầu chờ', value: stats.requests.pending, change: '0%', date: getCurrentDate() }
  ];

  return (
    <Container className={styles.statisticsDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.dashboardTitle}>📊 Dashboard Thống Kê</h2>
          <p className={styles.dashboardSubtitle}>Phân tích và báo cáo chi tiết hệ thống</p>
          {lastUpdated && (
            <small className="text-muted">
              Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
            </small>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
          <FaExclamationCircle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Unified Toolbar */}
      <Card className={styles.toolbarCard}>
        <Card.Body className={styles.toolbarBody}>
          <Row className={styles.toolbarRow}>
            {/* Date Range Buttons */}
            <Col md={6}>
              <div className={styles.dateRangeButtons}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xem thống kê tuần này</Tooltip>}
                >
                  <Button
                    variant={dateRange === 'week' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDateRangeChange('week')}
                    className={styles.toolbarBtn}
                  >
                    Tuần này
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xem thống kê tháng này</Tooltip>}
                >
                  <Button
                    variant={dateRange === 'month' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDateRangeChange('month')}
                    className={styles.toolbarBtn}
                  >
                    Tháng này
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xem thống kê quý này</Tooltip>}
                >
                  <Button
                    variant={dateRange === 'quarter' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDateRangeChange('quarter')}
                    className={styles.toolbarBtn}
                  >
                    Quý này
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xem thống kê năm nay</Tooltip>}
                >
                  <Button
                    variant={dateRange === 'year' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDateRangeChange('year')}
                    className={styles.toolbarBtn}
                  >
                    Năm nay
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Chọn khoảng thời gian tùy chỉnh</Tooltip>}
                >
                  <Button
                    variant={dateRange === 'custom' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDateRangeChange('custom')}
                    className={styles.toolbarBtn}
                  >
                    Tùy chọn
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
            
            {/* Action Buttons */}
            <Col md={6}>
              <div className={styles.actionButtons}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xem thống kê chi tiết</Tooltip>}
                >
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    onClick={() => setShowSummaryModal(true)}
                    className={styles.toolbarBtn}
                  >
                    <FaEye />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{showCharts ? 'Ẩn biểu đồ' : 'Hiện biểu đồ'}</Tooltip>}
                >
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => setShowCharts(!showCharts)}
                    className={styles.toolbarBtn}
                  >
                    {showCharts ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Làm mới dữ liệu</Tooltip>}
                >
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={handleRefresh}
                    className={styles.toolbarBtn}
                  >
                    <FaRedo />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Xuất báo cáo</Tooltip>}
                >
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    onClick={() => setShowExport(true)}
                    className={styles.toolbarBtn}
                  >
                    <FaDownload />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Bộ lọc nâng cao</Tooltip>}
                >
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={styles.toolbarBtn}
                  >
                    <FaFilter />
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Row className={styles.filtersRow}>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Standard">Tiêu chuẩn</option>
                <option value="Deluxe">Cao cấp</option>
                <option value="Suite">Hạng sang</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="Cancelled">Đã hủy</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Thanh toán</Form.Label>
              <Form.Select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Unpaid">Chưa thanh toán</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      )}

      {/* Key Metrics Cards */}
      <Row className={styles.metricsRow}>
        <Col md={3}>
          <StatCard
            icon={<FaUsers />}
            title="Tổng đặt phòng"
            value={stats.booking.total}
            subtitle={`${stats.booking.confirmed} đã xác nhận`}
            color="primary"
            trend={getGrowthIcon(12)}
            trendText="+12%"
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Tổng doanh thu"
            value={`${stats.revenue.total.toLocaleString()}₫`}
            subtitle={`${stats.revenue.paid.toLocaleString()}₫ đã thanh toán`}
            color="success"
            trend={getGrowthIcon(8)}
            trendText="+8%"
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={<FaCheckCircle />}
            title="Tỷ lệ xác nhận"
            value={`${stats.booking.confirmationRate}%`}
            subtitle={`${stats.booking.cancelled} đã hủy`}
            color="info"
            trend={getGrowthIcon(2)}
            trendText="+2%"
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={<FaClock />}
            title="Yêu cầu chờ"
            value={stats.requests.pending}
            subtitle="Cần xử lý"
            color="warning"
            trend={<FaExclamationTriangle />}
            trendText="Cần chú ý"
          />
        </Col>
      </Row>

      {/* Real-time Stats */}
      <Row className={styles.realTimeRow}>
        <Col md={12}>
          <Card className={styles.realTimeCard}>
            <Card.Header>
              <h6 className={styles.realTimeTitle}>
                <FaInfoCircle className="me-2" />
                Thống kê thời gian thực
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className={styles.realTimeItem}>
                    <div className={styles.realTimeLabel}>Đặt phòng hôm nay</div>
                    <div className={styles.realTimeValue}>{realTimeData.todayBookings}</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className={styles.realTimeItem}>
                    <div className={styles.realTimeLabel}>Doanh thu hôm nay</div>
                    <div className={styles.realTimeValue}>{realTimeData.todayRevenue.toLocaleString()}₫</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className={styles.realTimeItem}>
                    <div className={styles.realTimeLabel}>Tổng phòng</div>
                    <div className={styles.realTimeValue}>{realTimeData.totalRooms}</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className={styles.realTimeItem}>
                    <div className={styles.realTimeLabel}>Yêu cầu chờ</div>
                    <div className={styles.realTimeValue}>{realTimeData.pendingRequests}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Statistics */}
      <Row className={styles.detailedStatsRow}>
        <Col md={6}>
          <Card className={styles.detailCard}>
            <Card.Header>
              <h6 className={styles.detailTitle}>
                <FaChartBar className="me-2" />
                Thống kê doanh thu
              </h6>
            </Card.Header>
            <Card.Body>
              <div className={styles.revenueDetails}>
                <div className={styles.revenueItem}>
                  <span>Doanh thu trung bình:</span>
                  <strong>{stats.revenue.averagePerBooking.toLocaleString()}₫/booking</strong>
                </div>
                <div className={styles.revenueItem}>
                  <span>Chưa thanh toán:</span>
                  <strong className="text-danger">{stats.revenue.unpaid.toLocaleString()}₫</strong>
                </div>
                <div className={styles.revenueItem}>
                  <span>Khách hàng mới:</span>
                  <strong>{stats.customer.newCustomers} người</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={styles.detailCard}>
            <Card.Header>
              <h6 className={styles.detailTitle}>
                <FaHotel className="me-2" />
                Thống kê phòng
              </h6>
            </Card.Header>
            <Card.Body>
              <div className={styles.roomDetails}>
                <div className={styles.roomItem}>
                  <span>Tổng phòng:</span>
                  <strong>{stats.room.total} phòng</strong>
                </div>
                <div className={styles.roomItem}>
                  <span>Sức chứa:</span>
                  <strong>{stats.room.totalCapacity} người</strong>
                </div>
                <div className={styles.roomItem}>
                  <span>Trung bình:</span>
                  <strong>{stats.room.total > 0 ? Math.round(stats.room.totalCapacity / stats.room.total) : 0} người/phòng</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      {showCharts && (
        <Row className={styles.chartsRow}>
          <Col md={12}>
            <Card className={styles.chartCard}>
              <Card.Header>
                <h6 className={styles.chartTitle}>
                  <FaChartLine className="me-2" />
                  Biểu đồ xu hướng đặt phòng
                </h6>
              </Card.Header>
              <Card.Body>
                {bookingStats.length > 0 ? (
                  <div className={styles.chartPlaceholder}>
                    <FaChartLine size={48} className="text-muted mb-3" />
                    <h5>Dữ liệu biểu đồ</h5>
                    <p>Hiển thị {bookingStats.length} ngày dữ liệu thống kê</p>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setShowSummaryModal(true)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                ) : (
                  <div className={styles.noData}>
                    <FaChartLine size={48} className="text-muted mb-3" />
                    <h5>Không có dữ liệu</h5>
                    <p>Chưa có dữ liệu thống kê trong khoảng thời gian này</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Loading Spinner */}
      {loading && (
        <LoadingSpinner 
          text="Đang tải dữ liệu thống kê..." 
          fullScreen 
          overlay 
        />
      )}

      {/* Export Modal */}
      <ExportDataModal
        show={showExport}
        onHide={() => setShowExport(false)}
        data={exportData}
        columns={exportColumns}
        defaultFileName="statistics-report"
        title="Xuất báo cáo thống kê"
        onExport={(config) => {
          console.log('Exporting with config:', config);
          setShowExport(false);
        }}
      />

      {/* Summary Stats Modal */}
      <SummaryStatsModal
        show={showSummaryModal}
        onHide={() => setShowSummaryModal(false)}
        data={{
          booking: stats.booking,
          revenue: stats.revenue,
          customer: stats.customer,
          room: stats.room,
          requests: stats.requests,
          bookingStats: bookingStats
        }}
        title="Thống kê chi tiết"
        dateRange={`${dateRange === 'week' ? 'Tuần này' : 
                   dateRange === 'month' ? 'Tháng này' : 
                   dateRange === 'quarter' ? 'Quý này' : 
                   dateRange === 'year' ? 'Năm nay' : 'Tùy chọn'}`}
      />
    </Container>
  );
};

export default StatisticsDashboard; 