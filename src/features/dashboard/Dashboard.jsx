import React, { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import styles from './Dashboard.module.scss';
import { getDashboardSummary } from './DashboardAPI';
import SummaryStats from './SummaryStats';

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

const Dashboard = () => {
  const [data, setData] = useState([]); // mảng trả về từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { start, end };
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          startDate: toDateInputValue(dateRange.start),
          endDate: toDateInputValue(dateRange.end),
          groupBy: 'day',
        };
        const res = await getDashboardSummary(params);
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  return (
    <div className={styles.dashboardWrap}>
      <h1 className={styles.dashboardTitle}>Bảng điều khiển</h1>
      {/* Bộ lọc thời gian */}
      <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:24}}>
        <span style={{fontWeight:500}}>Từ ngày:</span>
        <input type="date" name="start" value={toDateInputValue(dateRange.start)} onChange={handleDateChange} />
        <span style={{fontWeight:500}}>Đến ngày:</span>
        <input type="date" name="end" value={toDateInputValue(dateRange.end)} onChange={handleDateChange} />
      </div>
      {loading && <div className="text-center my-4"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <SummaryStats data={data} title="Tổng quan đặt phòng" />
      )}
    </div>
  );
};

export default Dashboard;
