import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaUsers, 
  FaHotel, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaCalendar,
  FaStar,
  FaEye,
  FaDownload,
  FaTimes
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import styles from './SummaryStatsModal.module.scss';

const SummaryStatsModal = ({ 
  show, 
  onHide, 
  data = {}, 
  title = 'Thống kê chi tiết',
  dateRange = '30 ngày qua'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.bookingStats && Array.isArray(data.bookingStats)) {
      setChartData(data.bookingStats.map(item => ({
        date: item.date,
        totalBookings: item.totalBookings || 0,
        confirmedBookings: item.confirmedBookings || 0,
        cancelledBookings: item.cancelledBookings || 0,
        revenue: item.totalRevenue || 0,
        paidRevenue: item.paidRevenue || 0
      })));
    }
  }, [data]);

  const renderOverviewCards = () => (
    <Row className={styles.overviewCards}>
      <Col md={3}>
        <Card className={styles.statCard}>
          <Card.Body>
            <div className={styles.cardHeader}>
              <FaUsers className={styles.cardIcon} />
              <div className={styles.cardTitle}>Tổng đặt phòng</div>
            </div>
            <div className={styles.cardValue}>{data.booking?.total || 0}</div>
            <div className={styles.cardSubtitle}>
              <FaCheckCircle className="text-success me-1" />
              {data.booking?.confirmed || 0} đã xác nhận
            </div>
            <ProgressBar 
              now={data.booking?.total > 0 ? (data.booking.confirmed / data.booking.total) * 100 : 0} 
              className={styles.progressBar}
            />
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3}>
        <Card className={styles.statCard}>
          <Card.Body>
            <div className={styles.cardHeader}>
              <FaMoneyBillWave className={styles.cardIcon} />
              <div className={styles.cardTitle}>Doanh thu</div>
            </div>
            <div className={styles.cardValue}>
              {(data.revenue?.total || 0).toLocaleString()}₫
            </div>
            <div className={styles.cardSubtitle}>
              <FaCheckCircle className="text-success me-1" />
              {(data.revenue?.paid || 0).toLocaleString()}₫ đã thanh toán
            </div>
            <ProgressBar 
              now={data.revenue?.total > 0 ? (data.revenue.paid / data.revenue.total) * 100 : 0} 
              className={styles.progressBar}
            />
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3}>
        <Card className={styles.statCard}>
          <Card.Body>
            <div className={styles.cardHeader}>
              <FaHotel className={styles.cardIcon} />
              <div className={styles.cardTitle}>Phòng</div>
            </div>
            <div className={styles.cardValue}>{data.room?.total || 0}</div>
            <div className={styles.cardSubtitle}>
              Sức chứa: {data.room?.totalCapacity || 0} người
            </div>
            <div className={styles.cardExtra}>
              <Badge bg="info" className="me-1">Tiêu chuẩn</Badge>
              <Badge bg="success" className="me-1">Cao cấp</Badge>
              <Badge bg="warning">Suite</Badge>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3}>
        <Card className={styles.statCard}>
          <Card.Body>
            <div className={styles.cardHeader}>
              <FaClock className={styles.cardIcon} />
              <div className={styles.cardTitle}>Yêu cầu chờ</div>
            </div>
            <div className={styles.cardValue}>{data.requests?.pending || 0}</div>
            <div className={styles.cardSubtitle}>
              <FaExclamationTriangle className="text-warning me-1" />
              Cần xử lý
            </div>
            <div className={styles.cardExtra}>
              <Badge bg="warning">Chờ duyệt</Badge>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderDetailedStats = () => (
    <Row className={styles.detailedStats}>
      <Col md={6}>
        <Card className={styles.detailCard}>
          <Card.Header>
            <h6 className={styles.detailTitle}>
              <FaChartBar className="me-2" />
              Tỷ lệ xác nhận & hủy
            </h6>
          </Card.Header>
          <Card.Body>
            <div className={styles.rateContainer}>
              <div className={styles.rateItem}>
                <div className={styles.rateLabel}>Tỷ lệ xác nhận</div>
                <div className={styles.rateValue}>
                  {data.booking?.confirmationRate || 0}%
                  <FaArrowUp className="text-success ms-2" />
                </div>
                <ProgressBar 
                  now={parseFloat(data.booking?.confirmationRate || 0)} 
                  variant="success"
                  className={styles.rateProgress}
                />
              </div>
              
              <div className={styles.rateItem}>
                <div className={styles.rateLabel}>Tỷ lệ hủy</div>
                <div className={styles.rateValue}>
                  {data.booking?.cancellationRate || 0}%
                  <FaArrowDown className="text-danger ms-2" />
                </div>
                <ProgressBar 
                  now={parseFloat(data.booking?.cancellationRate || 0)} 
                  variant="danger"
                  className={styles.rateProgress}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className={styles.detailCard}>
          <Card.Header>
            <h6 className={styles.detailTitle}>
              <FaMoneyBillWave className="me-2" />
              Thống kê doanh thu
            </h6>
          </Card.Header>
          <Card.Body>
            <div className={styles.revenueStats}>
              <div className={styles.revenueItem}>
                <div className={styles.revenueLabel}>Doanh thu trung bình</div>
                <div className={styles.revenueValue}>
                  {(data.revenue?.averagePerBooking || 0).toLocaleString()}₫/booking
                </div>
              </div>
              
              <div className={styles.revenueItem}>
                <div className={styles.revenueLabel}>Chưa thanh toán</div>
                <div className={`${styles.revenueValue} text-danger`}>
                  {(data.revenue?.unpaid || 0).toLocaleString()}₫
                </div>
              </div>
              
              <div className={styles.revenueItem}>
                <div className={styles.revenueLabel}>Khách hàng mới</div>
                <div className={styles.revenueValue}>
                  {data.customer?.newCustomers || 0} người
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className={styles.noData}>
          <FaChartLine size={48} className="text-muted mb-3" />
          <h5>Không có dữ liệu biểu đồ</h5>
          <p>Chưa có dữ liệu thống kê trong khoảng thời gian này</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
          <YAxis tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
          <RechartsTooltip contentStyle={{fontSize:14}} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalBookings" 
            stroke="#ff6b6b" 
            strokeWidth={3} 
            dot={{ r: 5, fill: '#ff6b6b' }} 
            name="Tổng booking" 
          />
          <Line 
            type="monotone" 
            dataKey="confirmedBookings" 
            stroke="#4facfe" 
            strokeWidth={3} 
            dot={{ r: 5, fill: '#4facfe' }} 
            name="Đã xác nhận" 
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#28a745" 
            strokeWidth={3} 
            dot={{ r: 5, fill: '#28a745' }} 
            name="Doanh thu" 
            yAxisId={1}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      className={styles.summaryStatsModal}
      centered
    >
      <Modal.Header className={styles.modalHeader}>
        <div className={styles.modalTitleContainer}>
          <Modal.Title>
            <FaChartLine className="me-2" />
            {title}
          </Modal.Title>
          <div className={styles.modalSubtitle}>
            <FaCalendar className="me-1" />
            {dateRange}
          </div>
        </div>
        <button 
          type="button" 
          className={styles.closeButton}
          onClick={onHide}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </Modal.Header>
      
      <Modal.Body className={styles.modalBody}>
        {/* Overview Cards */}
        {renderOverviewCards()}
        
        {/* Detailed Statistics */}
        {renderDetailedStats()}
        
        {/* Chart Section */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <div className={styles.chartHeader}>
              <h6 className={styles.chartTitle}>
                <FaChartLine className="me-2" />
                Biểu đồ xu hướng đặt phòng và doanh thu
              </h6>
              <div className={styles.chartActions}>
                <button className={styles.chartActionBtn}>
                  <FaEye size={14} />
                </button>
                <button className={styles.chartActionBtn}>
                  <FaDownload size={14} />
                </button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className={styles.chartBody}>
            {renderChart()}
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className={styles.modalFooter}>
        <div className={styles.footerInfo}>
          <small className="text-muted">
            Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </small>
        </div>
        <div className={styles.footerActions}>
          <button className={styles.footerBtn} onClick={onHide}>
            Đóng
          </button>
          <button className={`${styles.footerBtn} ${styles.primaryBtn}`}>
            <FaDownload className="me-1" />
            Xuất báo cáo
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SummaryStatsModal; 