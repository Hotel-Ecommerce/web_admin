import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getBookingStatistics } from '../statistics/StatisticsAPI';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const stats = [
    { title: 'Khách hàng', count: 128, variant: 'primary' },
    { title: 'Phòng đang trống', count: 42, variant: 'success' },
    { title: 'Đơn đặt phòng', count: 87, variant: 'warning' },
    { title: 'Hoá đơn hôm nay', count: 15, variant: 'danger' },
  ];

  // State cho biểu đồ booking statistics
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Lấy 7 ngày gần nhất
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const params = {
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10),
          groupBy: 'day',
        };
        const data = await getBookingStatistics(params);
        setChartData(Array.isArray(data) ? data : [data]);
      } catch {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container fluid className={styles.dashboardPageContainer}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>Thống kê tổng quan</h2>
      </div>
      <Row>
        {stats.map((item, index) => (
          <Col md={3} sm={6} xs={12} key={index} className="mb-4">
            <Card bg={item.variant.toLowerCase()} text="white">
              <Card.Body>
                <Card.Title className="fs-5">{item.title}</Card.Title>
                <Card.Text className="fs-3 fw-bold">{item.count}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className={styles.dashboardChart}>
        <Col md={12}>
          <h4 className="mb-3">Biểu đồ đơn đặt phòng 7 ngày gần nhất</h4>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalBookings" fill="#8884d8" name="Tổng đặt phòng" />
                <Bar dataKey="confirmedBookings" fill="#82ca9d" name="Đã xác nhận" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
