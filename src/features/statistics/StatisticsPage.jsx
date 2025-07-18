import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getBookingStatistics } from './StatisticsAPI';
import { getRooms } from '../rooms/RoomAPI';
import { getCustomers } from '../customers/CustomerAPI';
import { getEmployees } from '../employees/EmployeeAPI';
import styles from './StatisticsPage.module.scss';
import SummaryStats from '../dashboard/SummaryStats';
import ExportExcelModal from './ExportExcelModal';
import FilterModal from './components/FilterModal/FilterModal';
import { FiFilter, FiFileText } from 'react-icons/fi';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Pending', label: 'Chờ xác nhận' },
];

const StatisticsPage = () => {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    startDate: weekAgo,
    endDate: today,
    groupBy: 'day',
    roomType: '',
    status: ''
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [showExport, setShowExport] = useState(false);

  // Lấy danh sách phòng khi load trang
  useEffect(() => {
    (async () => {
      try {
        const roomList = await getRooms();
        setRooms(Array.isArray(roomList) ? roomList : roomList.rooms || []);
      } catch {}
    })();
  }, []);

  // Lấy danh sách loại phòng duy nhất
  const roomTypes = Array.from(new Set(rooms.map(r => r.type).filter(Boolean)));

  // Hàm fetch mới dùng filter
  const fetchWithFilter = async (f) => {
    setError('');
    setLoading(true);
    try {
      const params = { ...f };
      const data = await getBookingStatistics(params);
      setChartData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError('Không thể lấy dữ liệu thống kê!');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi load lần đầu, fetch dữ liệu với filter mặc định
  useEffect(() => { fetchWithFilter(filter); }, []);

  return (
    <Container className={styles.statisticsPageContainer}>
      <div className={styles.statisticsHeader}>
        <h2 className={styles.statisticsTitle}>Thống kê đặt phòng</h2>
        <Button variant="primary" onClick={() => setShowFilter(true)} style={{marginLeft:16}} aria-label="Bộ lọc nâng cao" title="Bộ lọc nâng cao">
          <FiFilter size={26} color="#ff9800" />
        </Button>
      </div>
      <FilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={f => { setFilter(f); fetchWithFilter(f); }}
        rooms={rooms}
        defaultFilter={filter}
      />
      {error && <div className="text-danger mb-3">{error}</div>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        chartData.length > 0 && (
          <>
            <SummaryStats data={chartData} title="Tổng quan đặt phòng" />
            <div className="mb-2 text-end">
              <Button variant="success" onClick={() => setShowExport(true)}>
                <FiFileText size={20} style={{marginRight: 6, marginBottom: 2}} /> Xuất Excel
              </Button>
            </div>
            <ExportExcelModal show={showExport} onClose={() => setShowExport(false)} data={chartData} defaultFileName={`thong_ke_booking_${filter.startDate}_to_${filter.endDate}.xlsx`} />
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