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
            <Form.Label style={{color:'#1C1C1E'}}>Từ ngày</Form.Label>
            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #e9ecef', borderRadius: 8 }} />
          </Col>
          <Col md={3}>
            <Form.Label style={{color:'#1C1C1E'}}>Đến ngày</Form.Label>
            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #e9ecef', borderRadius: 8 }} />
          </Col>
          <Col md={3}>
            <Form.Label style={{color:'#1C1C1E'}}>Nhóm theo</Form.Label>
            <Form.Select value={groupBy} onChange={e => setGroupBy(e.target.value)} style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #e9ecef', borderRadius: 8 }}>
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button type="submit" style={{background:'#00AEEF', color:'#fff', border:'none', borderRadius: 6, fontWeight: 500, fontSize: '1rem', padding: '0.5rem 1.2rem', transition: 'background 0.2s'}} onMouseOver={e => e.currentTarget.style.background = '#0095c8'} onMouseOut={e => e.currentTarget.style.background = '#00AEEF'}>
              Lấy thống kê
            </Button>
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
                <Bar dataKey="totalBookings" fill="#00AEEF" name="Tổng đặt phòng" />
                <Bar dataKey="confirmedBookings" fill="#28a745" name="Đã xác nhận" />
              </BarChart>
            </ResponsiveContainer>
            <h5 className="mt-4" style={{color:'#1C1C1E', fontWeight:600}}>Bảng số liệu</h5>
            <Table striped bordered hover responsive style={{background:'#fff', border:'1px solid #e9ecef', borderRadius:8}}>
              <thead>
                <tr style={{background:'#F7F9FC'}}>
                  <th style={{color:'#1C1C1E', fontWeight:600}}>Ngày</th>
                  <th style={{color:'#1C1C1E', fontWeight:600}}>Tổng đặt phòng</th>
                  <th style={{color:'#1C1C1E', fontWeight:600}}>Đã xác nhận</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{color:'#1C1C1E'}}>{row.date}</td>
                    <td style={{color:'#1C1C1E'}}>{row.totalBookings}</td>
                    <td style={{color:'#1C1C1E'}}>{row.confirmedBookings}</td>
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