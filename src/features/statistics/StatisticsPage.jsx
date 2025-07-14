import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getBookingStatistics } from './StatisticsAPI';
import styles from './StatisticsPage.module.scss';

const StatisticsPage = () => {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [groupBy, setGroupBy] = useState('day');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = { startDate, endDate, groupBy };
      const data = await getBookingStatistics(params);
      setChartData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError('Không thể lấy dữ liệu thống kê!');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={styles.statisticsPageContainer}>
      <div className={styles.statisticsHeader}>
        <h2 className={styles.statisticsTitle}>Thống kê đặt phòng</h2>
      </div>
      <Form onSubmit={handleFetch} className={styles.statisticsFilterBar}>
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Từ ngày</Form.Label>
            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </Col>
          <Col md={3}>
            <Form.Label>Đến ngày</Form.Label>
            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </Col>
          <Col md={3}>
            <Form.Label>Nhóm theo</Form.Label>
            <Form.Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button type="submit" variant="primary">Lấy thống kê</Button>
          </Col>
        </Row>
      </Form>
      {error && <div className="text-danger mb-3">{error}</div>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        chartData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={350}>
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
            <h5 className="mt-4">Bảng số liệu</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Tổng đặt phòng</th>
                  <th>Đã xác nhận</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>{row.totalBookings}</td>
                    <td>{row.confirmedBookings}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )
      )}
    </Container>
  );
};

export default StatisticsPage; 