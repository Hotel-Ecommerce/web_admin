import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.scss';
import { getDashboardSummary } from './DashboardAPI';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = summary ? [
    { icon: '🛏️', value: summary.occupancyRate ? `${summary.occupancyRate}%` : '0%', label: 'Tỉ lệ lấp đầy', color: '#1E2A38' },
    { icon: '✅', value: summary.checkInCount || 0, label: 'Nhận phòng', color: '#00AEEF' },
    { icon: '➡️', value: summary.checkOutCount || 0, label: 'Trả phòng', color: '#ffc107', textColor: '#1C1C1E' },
    { icon: '₫', value: summary.revenue ? summary.revenue.toLocaleString() : '0', label: 'Doanh thu', color: '#28a745' },
  ] : [];

  const statusLegend = [
    { label: 'Đang có khách', color: '#28a745' },
    { label: 'Sắp trả', color: '#ffc107' },
    { label: 'Đang dọn', color: '#dc3545' },
  ];

  const roomBoxes = (summary?.roomStatus || []).map((room, idx) => ({
    number: room.number || room.name || room._id || idx,
    status: room.status,
    color:
      room.status === 'occupied' ? '#28a745' :
      room.status === 'dueout' ? '#ffc107' :
      room.status === 'cleaning' ? '#dc3545' : '#e0e0e0',
  }));

  const recentBookings = summary?.recentBookings || [];
  const chartData = summary?.chartData || [];

  return (
    <div className={styles.dashboardWrap}>
      <h1 className={styles.dashboardTitle}>Bảng điều khiển</h1>
      {loading && <div className="text-center my-4"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && summary && (
        <>
          <div className={styles.statsRow}>
            {statCards.map((item, idx) => (
              <div className={styles.statCard} key={idx} style={{ background: item.color, color: item.textColor || '#fff' }}>
                <div className={styles.statIcon}>{item.icon}</div>
                <div className={styles.statValue}>{item.value}</div>
                <div className={styles.statLabel}>{item.label}</div>
              </div>
            ))}
          </div>
          <div className={styles.gridRow}>
            <Card className={styles.roomStatusCard}>
              <div className={styles.cardTitle}>Trạng thái phòng</div>
              <div className={styles.roomStatusGrid}>
                {roomBoxes.map((room, idx) => (
                  <div key={idx} className={styles.roomBox} style={{ background: room.color }}>
                    {room.number}
                  </div>
                ))}
              </div>
              <div className={styles.statusLegend}>
                {statusLegend.map((s, idx) => (
                  <span key={idx} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: s.color }}></span>
                    {s.label}
                  </span>
                ))}
              </div>
            </Card>
            <Card className={styles.reservationsCard}>
              <div className={styles.cardTitle}>Đặt phòng gần đây</div>
              <div className={styles.reservationsList}>
                {recentBookings.map((r, idx) => (
                  <div key={idx} className={styles.reservationRow}>
                    <span>{r.customerName || r.customer?.name || r.name}</span>
                    <span>{r.checkInDate || r.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className={styles.gridRow}>
            <Card className={styles.occupancyCard}>
              <div className={styles.cardTitle}>Tỉ lệ lấp đầy</div>
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <XAxis dataKey="day" tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#00AEEF" strokeWidth={3} dot={{ r: 5, fill: '#00AEEF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className={styles.reservationsCard}>
              <div className={styles.cardTitle}>Đặt phòng gần đây</div>
              <div className={styles.reservationsList}>
                {recentBookings.map((r, idx) => (
                  <div key={idx} className={styles.reservationRow}>
                    <span>{r.customerName || r.customer?.name || r.name}</span>
                    <span>{r.checkOutDate || r.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
