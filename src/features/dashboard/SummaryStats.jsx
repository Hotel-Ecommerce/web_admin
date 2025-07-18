import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.scss';

/**
 * SummaryStats component dùng chung cho Dashboard và trang Thống kê
 * @param {Array} data - Mảng object thống kê theo ngày (các trường: date, totalBookings, confirmedBookings, totalRevenue, ...)
 * @param {string} title - Tiêu đề (tùy chọn)
 * @param {Array} extraStats - Mảng các object {label, value, icon, color} để hiển thị thêm card số liệu (tùy chọn)
 */
const SummaryStats = ({ data = [], title = 'Tổng quan', extraStats = [] }) => {
  // Tổng hợp số liệu
  const totalBookings = data.reduce((sum, d) => sum + (d.totalBookings || 0), 0);
  const confirmedBookings = data.reduce((sum, d) => sum + (d.confirmedBookings || 0), 0);
  const totalRevenue = data.reduce((sum, d) => sum + (d.totalRevenue || 0), 0);
  // Chart data
  const chartData = data.map(d => ({
    day: d.date,
    value: d.confirmedBookings || 0
  }));

  // Card số liệu tổng quan
  const statCards = [
    { icon: '📦', value: totalBookings, label: 'Tổng booking', color: '#1E2A38' },
    { icon: '✅', value: confirmedBookings, label: 'Đã xác nhận', color: '#00AEEF' },
    { icon: '₫', value: totalRevenue.toLocaleString(), label: 'Doanh thu', color: '#28a745' },
    ...extraStats
  ];

  return (
    <div className={styles.dashboardWrap}>
      <h2 className={styles.dashboardTitle}>{title}</h2>
      <div className={styles.statsRow}>
        {statCards.map((item, idx) => (
          <div className={styles.statCard} key={idx} style={{ background: item.color, color: item.textColor || '#fff' }}>
            <div className={styles.statIcon}>{item.icon}</div>
            <div className={styles.statValue}>{item.value}</div>
            <div className={styles.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>
      <Card className={styles.occupancyCard}>
        <div className={styles.cardTitle}>Biểu đồ booking đã xác nhận theo ngày</div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <XAxis dataKey="day" tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
              <YAxis tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
              <RechartsTooltip contentStyle={{fontSize:14}} />
              <Line type="monotone" dataKey="value" stroke="#00AEEF" strokeWidth={3} dot={{ r: 5, fill: '#00AEEF' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SummaryStats; 