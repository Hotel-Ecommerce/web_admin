import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import styles from './SummaryStats.module.scss';

/**
 * SummaryStats component dùng chung cho Dashboard và trang Thống kê
 * @param {Array} data - Mảng object thống kê theo ngày (các trường: date, totalBookings, confirmedBookings, totalRevenue, ...)
 * @param {string} title - Tiêu đề (tùy chọn)
 * @param {Array} extraStats - Mảng các object {label, value, icon, color} để hiển thị thêm card số liệu (tùy chọn)
 * @param {boolean} showChart - Hiển thị biểu đồ (mặc định: true)
 * @param {string} chartType - Loại biểu đồ: 'line' hoặc 'bar' (mặc định: 'line')
 * @param {number} availableRooms - Số phòng trống (nếu có)
 */
const SummaryStats = ({ 
  data = [], 
  title = 'Tổng quan', 
  extraStats = [], 
  showChart = true,
  chartType = 'line',
  availableRooms
}) => {
  // Tổng hợp số liệu
  const totalBookings = data.reduce((sum, d) => sum + (d.totalBookings || 0), 0);
  const confirmedBookings = data.reduce((sum, d) => sum + (d.confirmedBookings || 0), 0);
  const totalRevenue = data.reduce((sum, d) => sum + (d.totalRevenue || 0), 0);
  
  // Tính toán thêm
  const confirmationRate = totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : 0;
  const averageRevenue = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0;
  const pendingBookings = totalBookings - confirmedBookings;

  // Chart data
  const chartData = data.map(d => ({
    day: d.date,
    totalBookings: d.totalBookings || 0,
    confirmedBookings: d.confirmedBookings || 0,
    revenue: d.totalRevenue || 0
  }));

  // Card số liệu tổng quan
  let statCards = [
    {
      icon: '📊',
      value: totalBookings.toLocaleString(),
      label: 'Tổng booking',
      subtitle: `${pendingBookings} chờ xác nhận`
    },
    {
      icon: '👥',
      value: confirmedBookings.toLocaleString(),
      label: 'Đã xác nhận',
      subtitle: `${confirmationRate}% tỷ lệ xác nhận`
    },
    {
      icon: '👤',
      value: totalRevenue.toLocaleString(),
      label: 'Doanh thu',
      subtitle: `TB: ${averageRevenue.toLocaleString()}₫/booking`
    },
    ...extraStats
  ];

  if (availableRooms !== undefined) {
    statCards = [
      {
        icon: '📄',
        value: availableRooms,
        label: 'Phòng trống',
        subtitle: 'Còn trống hôm nay'
      },
      ...statCards
    ];
  }

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
          <YAxis tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
          <RechartsTooltip contentStyle={{fontSize:14}} />
          <Legend />
          <Bar dataKey="totalBookings" fill="#ff6b6b" name="Tổng booking" />
          <Bar dataKey="confirmedBookings" fill="#4facfe" name="Đã xác nhận" />
        </BarChart>
      );
    }

    return (
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
        <YAxis tick={{ fill: '#1C1C1E', fontWeight: 500 }} />
        <RechartsTooltip contentStyle={{fontSize:14}} />
        <Legend />
        <Line type="monotone" dataKey="totalBookings" stroke="#ff6b6b" strokeWidth={3} dot={{ r: 5, fill: '#ff6b6b' }} name="Tổng booking" />
        <Line type="monotone" dataKey="confirmedBookings" stroke="#4facfe" strokeWidth={3} dot={{ r: 5, fill: '#4facfe' }} name="Đã xác nhận" />
      </LineChart>
    );
  };

  return (
    <div className={styles.dashboardWrap}>
      <h2 className={styles.dashboardTitle}>Thống kê tổng quan</h2>
      
      <div className={`${styles.statsRow} row`}>
        {statCards.map((item, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statIcon}>{item.icon}</div>
              <div className={`${styles.statValue} tabular-nums`}>{item.value}</div>
              <div className={styles.statLabel}>{item.label}</div>
              <div className={styles.statSubtitle}>{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      {showChart && (
        <Card className={styles.occupancyCard}>
          <div className={styles.cardTitle}>
            Biểu đồ {chartType === 'bar' ? 'cột' : 'đường'} booking theo ngày
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SummaryStats; 